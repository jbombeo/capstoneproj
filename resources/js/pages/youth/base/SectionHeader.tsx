import { ReactNode } from "react";

export default function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {icon && <div className="text-blue-600">{icon}</div>}
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
  );
}
