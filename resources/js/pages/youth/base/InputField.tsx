import React from "react";

export default function InputField({
  label,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        {...props}
        type={type}
        className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
