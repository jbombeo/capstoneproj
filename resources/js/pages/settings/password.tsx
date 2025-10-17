import InputError from "@/components/input-error";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { type BreadcrumbItem } from "@/types";
import { Transition } from "@headlessui/react";
import { Head, useForm } from "@inertiajs/react";
import { useRef } from "react";

import HeadingSmall from "@/components/heading-small";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Password settings",
    href: "/resident/settings/password", // 👈 just use the plain URL
  },
];

export default function Password() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put("/resident/settings/password", {   // 👈 your backend route here
      preserveScroll: true,
      onError: (errs) => {
        if (errs.password) {
          passwordInput.current?.focus();
        }
        if (errs.current_password) {
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Password settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Update password"
            description="Ensure your account is using a long, random password to stay secure"
          />

          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="current_password">Current password</Label>
              <Input
                id="current_password"
                ref={currentPasswordInput}
                name="current_password"
                type="password"
                value={data.current_password}
                onChange={(e) => setData("current_password", e.target.value)}
                autoComplete="current-password"
                placeholder="Current password"
              />
              <InputError message={errors.current_password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                ref={passwordInput}
                name="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                autoComplete="new-password"
                placeholder="New password"
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm password</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm password"
              />
              <InputError message={errors.password_confirmation} />
            </div>

            <div className="flex items-center gap-4">
              <Button disabled={processing}>Save password</Button>
              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-neutral-600">Saved</p>
              </Transition>
            </div>
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
