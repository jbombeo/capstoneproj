import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  full?: boolean;
}

export default function Button({ label, variant = "primary", full, ...props }: Props) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`
        px-4 py-2 rounded-lg font-semibold transition
        ${styles[variant]}
        ${full ? "w-full" : ""}
        ${props.className}
      `}
    >
      {label}
    </button>
  );
}
