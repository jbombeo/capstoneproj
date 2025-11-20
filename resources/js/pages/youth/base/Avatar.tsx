export default function Avatar({ name }: { name: string }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center">
      {initials}
    </div>
  );
}
