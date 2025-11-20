export default function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-gray-900 font-medium">{value ?? "—"}</p>
    </div>
  );
}
