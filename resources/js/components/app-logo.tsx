export default function AppLogo() {
  return (
    <div className="flex flex-col items-center text-center">
      {/* ✅ Bigger Logo */}
      <img
        src="/images/logo.png"
        alt="App Logo"
        className="w-32 h-32 object-contain" // increased logo size
      />

      {/* ✅ Brand name under logo */}
      <span className="mt-3 font-bold text-l text-white tracking-wide">
        Barangay System
      </span>
    </div>
  );
}
