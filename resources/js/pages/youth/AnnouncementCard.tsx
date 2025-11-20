import Card from "./base/Card";
import { Megaphone, User } from "lucide-react";

export default function AnnouncementCard({ a }: any) {
  return (
    <Card className="overflow-hidden p-0">
      {/* Image Header */}
      {a.image_path ? (
        <img
          src={`/storage/${a.image_path}`}
          alt={a.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
          <Megaphone className="w-10 h-10 opacity-60" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category + Date */}
        <div className="flex justify-between items-center">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
            {a.category ?? "Announcement"}
          </span>

          <span className="text-xs text-gray-500">
            {a.date} • {a.time}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {a.title}
        </h3>

        {/* Content (short preview) */}
        <p className="text-gray-700 text-sm line-clamp-3">
          {a.content}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 pt-2 text-sm text-gray-600">
          <User className="w-4 h-4" /> {a.author ?? "SK Council"}
        </div>
      </div>
    </Card>
  );
}
