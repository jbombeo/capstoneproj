import { useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import Card from "./base/Card";
import Button from "./base/button";
import { ClipboardList, BadgeCheck, CalendarClock } from "lucide-react";

/**
 * ScholarshipCard with built-in browser reminders.
 *
 * How reminders work:
 * - User picks a preset (1 day / 1 hour / 30 min) or custom minutes.
 * - We calculate trigger time = interview datetime - minutesBefore.
 * - We request Notification permission if needed.
 * - We save reminder meta in localStorage under `sk_reminder_${scholarship.id}`.
 * - We schedule a setTimeout to show a browser notification at trigger time (only works while tab/browser is open).
 * - When component mounts we rehydrate saved reminder and re-schedule timer.
 */

export default function ScholarshipCard({ scholarship }: any) {
  const { post, processing } = useForm();
  const status = scholarship.application_status;

  // Reminder state
  const [reminderScheduled, setReminderScheduled] = useState<any>(null);
  const [requestingPermission, setRequestingPermission] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<number | "">("");
  const timerRef = useRef<number | null>(null);

  const storageKey = `sk_reminder_${scholarship.id}`;

  // Helper: parse interview date/time into Date object (returns null if missing)
  function getInterviewDate(): Date | null {
    if (!scholarship.interview_date || !scholarship.interview_time) return null;
    const dt = new Date(`${scholarship.interview_date}T${scholarship.interview_time}`);
    if (isNaN(dt.getTime())) return null;
    return dt;
  }

  // Show a notification (or fallback alert)
  function showNotification(title: string, body: string) {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body });
      } catch (err) {
        // fallback
        alert(`${title}\n\n${body}`);
      }
    } else {
      // fallback UI alert
      alert(`${title}\n\n${body}`);
    }
  }

  // Schedule a setTimeout for the reminder (clears any existing)
  function scheduleTimer(triggerAt: number, meta: any) {
    // clear any previous timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const now = Date.now();
    const delay = triggerAt - now;

    if (delay <= 0) {
      // trigger immediately
      showNotification("Interview reminder", `${meta.title} interview is happening now.`);
      setReminderScheduled(meta);
      localStorage.setItem(storageKey, JSON.stringify(meta));
      return;
    }

    const id = window.setTimeout(() => {
      showNotification(
        `Interview reminder — ${meta.title}`,
        `Your interview for "${meta.title}" starts at ${meta.interview_date} ${meta.interview_time}`
      );
      // Optionally clear reminder after firing:
      localStorage.removeItem(storageKey);
      setReminderScheduled(null);
      timerRef.current = null;
    }, delay);

    timerRef.current = id;
  }

  // Request Notification permission (returns true if granted)
  async function ensureNotificationPermission() {
    if (!("Notification" in window)) {
      // Not supported
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;

    setRequestingPermission(true);
    const perm = await Notification.requestPermission();
    setRequestingPermission(false);
    return perm === "granted";
  }

  // Schedule reminder (minutesBefore = minutes before interview)
  async function scheduleReminder(minutesBefore: number) {
    const interview = getInterviewDate();
    if (!interview) {
      alert("Interview date/time is not set for this application.");
      return;
    }

    const triggerAt = interview.getTime() - minutesBefore * 60000;
    if (triggerAt <= Date.now()) {
      alert("Selected reminder time is in the past. Choose a shorter reminder time.");
      return;
    }

    // ask for permission
    const ok = await ensureNotificationPermission();
    if (!ok) {
      // still save reminder but inform user notifications are blocked
      const meta = {
        title: scholarship.title,
        interview_date: scholarship.interview_date,
        interview_time: scholarship.interview_time,
        minutesBefore,
        scheduledAt: Date.now(),
        note: "Notifications not granted — reminder saved but browser notification won't appear.",
      };
      localStorage.setItem(storageKey, JSON.stringify(meta));
      setReminderScheduled(meta);
      scheduleTimer(triggerAt, meta); // we still schedule in case page open
      alert("Notifications are blocked/unsupported. Reminder saved locally but no browser notification will appear.");
      return;
    }

    // Permission OK
    const meta = {
      title: scholarship.title,
      interview_date: scholarship.interview_date,
      interview_time: scholarship.interview_time,
      minutesBefore,
      scheduledAt: Date.now(),
    };

    localStorage.setItem(storageKey, JSON.stringify(meta));
    setReminderScheduled(meta);
    scheduleTimer(triggerAt, meta);
  }

  // Cancel saved reminder
  function cancelReminder() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    localStorage.removeItem(storageKey);
    setReminderScheduled(null);
    alert("Reminder cancelled.");
  }

  // Rehydrate saved reminder on mount / when scholarship interview changes
  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const meta = JSON.parse(raw);
      // verify interview still matches
      const interview = getInterviewDate();
      if (!interview) {
        // interview no longer present: remove saved
        localStorage.removeItem(storageKey);
        setReminderScheduled(null);
        return;
      }

      // compute trigger time from meta
      const triggerAt = new Date(`${meta.interview_date}T${meta.interview_time}`).getTime() - (meta.minutesBefore || 0) * 60000;
      // If trigger is in the future, schedule
      if (triggerAt > Date.now()) {
        setReminderScheduled(meta);
        scheduleTimer(triggerAt, meta);
      } else {
        // expired — remove
        localStorage.removeItem(storageKey);
        setReminderScheduled(null);
      }
    } catch (err) {
      // invalid JSON
      localStorage.removeItem(storageKey);
      setReminderScheduled(null);
    }

    // cleanup on unmount
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholarship.interview_date, scholarship.interview_time, scholarship.id]);

  // Small UI helpers
  const interviewExists = !!(scholarship.interview_date && scholarship.interview_time);

  return (
    <Card className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">{scholarship.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Official SK Scholarship Program</p>
        </div>

        {status && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300"
            : status === "for interview" ? "bg-blue-100 text-blue-800 border-blue-300"
            : status === "for requirement" ? "bg-orange-100 text-orange-800 border-orange-300"
            : status === "granted" ? "bg-green-100 text-green-800 border-green-300"
            : "bg-gray-100 text-gray-700 border-gray-300"
          }`}>
            {status.toUpperCase()}
          </span>
        )}
      </div>

      {/* Interview block */}
      {status === "for interview" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 items-start">
          <CalendarClock className="w-6 h-6 text-blue-700" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">Interview Schedule</p>
            <p className="text-sm text-blue-800 mt-1"><strong>Date:</strong> {scholarship.interview_date || "Not set"}</p>
            <p className="text-sm text-blue-800"><strong>Time:</strong> {scholarship.interview_time || "Not set"}</p>

            {/* Reminder UI */}
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">Reminders</p>

              {/* Current scheduled */}
              {reminderScheduled ? (
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-sm">
                    <div>Scheduled {reminderScheduled.minutesBefore} minutes before interview</div>
                    <div className="text-xs text-gray-500">
                      Interview: {reminderScheduled.interview_date} {reminderScheduled.interview_time}
                    </div>
                  </div>

                  <button
                    onClick={cancelReminder}
                    className="ml-auto px-3 py-1 bg-red-500 text-white text-sm rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <button
                    onClick={() => scheduleReminder(24 * 60)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg"
                  >
                    1 day before
                  </button>
                  <button
                    onClick={() => scheduleReminder(60)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg"
                  >
                    1 hour before
                  </button>
                  <button
                    onClick={() => scheduleReminder(30)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg"
                  >
                    30 minutes before
                  </button>

                  {/* Custom minutes */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      placeholder="minutes"
                      value={customMinutes as any}
                      onChange={(e) => setCustomMinutes(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-24 px-2 py-1 border rounded"
                    />
                    <button
                      onClick={() => {
                        if (!customMinutes || Number(customMinutes) <= 0) {
                          alert("Enter custom minutes before interview (positive number).");
                          return;
                        }
                        scheduleReminder(Number(customMinutes));
                      }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm rounded-lg"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!interviewExists && (
              <p className="text-xs text-gray-500 mt-2">No interview schedule set yet. Reminders require interview date/time.</p>
            )}
          </div>
        </div>
      )}

      {/* Remarks */}
      {scholarship.remarks && (
        <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-800">Remarks:</p>
          <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{scholarship.remarks}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-700 leading-relaxed text-sm">{scholarship.description}</p>

      {/* Grant amount (kept as before) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs tracking-wide uppercase text-blue-700 font-medium">Grant Amount</p>
        <p className="text-3xl font-bold text-blue-900 mt-1">₱{Number(scholarship.grant_amount).toLocaleString()}</p>
      </div>

      {/* Requirements */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
          <ClipboardList className="w-5 h-5 text-gray-700" /> Requirements
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          {Array.isArray(scholarship.requirements) ? scholarship.requirements.map((req: any, i: number) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 bg-gray-500 rounded-full" />
              <span>{req}</span>
            </li>
          )) : <li className="text-gray-500">No requirements listed</li>}
        </ul>
      </div>

      {/* Buttons / Apply */}
      <div className="pt-4 border-t border-gray-200">
        {!status && (
          <Button
            full
            label={processing ? "Submitting..." : "Apply Now"}
            onClick={() => post(`/youth/scholarships/${scholarship.id}/apply`, { preserveScroll: true, preserveState: true })}
            disabled={processing}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold tracking-wide py-3 rounded-lg"
          />
        )}

        {status === "granted" && (
          <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
            <BadgeCheck className="w-5 h-5" /> Congratulations! Your scholarship is granted.
          </div>
        )}
      </div>
    </Card>
  );
}
