import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-white 
        rounded-xl 
        border border-gray-200 
        shadow-sm 
        hover:shadow-md 
        transition 
        p-6 
        ${className}
      `}
    >
      {children}
    </div>
  );

}
