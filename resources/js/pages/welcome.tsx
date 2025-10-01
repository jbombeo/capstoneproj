import { Link } from '@inertiajs/react';

export default function Welcome() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* moving background image */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-bg-move"
        style={{
          backgroundImage: "url('/images/iponan.jpg')",
        }}
      ></div>

      {/* animated gradient overlay */}
      <div className="absolute inset-0 animated-bg"></div>

      {/* Top header bar */}
      <header className="z-20 w-full bg-green-900/90 text-white text-center py-3 text-sm">
        <h2 className="font-bold text-2xl tracking-wide">
          Barangay System Portal
        </h2>
        <p className="text-sm opacity-100">
          Official Registration and Services Portal
        </p>
      </header>

      {/* Emblem at top */}
      <div className="z-20 flex justify-center mt-6">
        <img
          src="/images/logo.png"
          alt="Barangay Emblem"
          className="z-20 w-70 h-70 animate-pulse-slow drop-shadow-xl glow-border"
        />
      </div>



      {/* Main content */}
      <div className="z-10 flex flex-col items-center mt-10 mb-10">
        {/* Buttons */}
        <div className="z-10 flex flex-col sm:flex-row gap-4 mt-10">
          <Link href="/dashboard" className="btn-agency btn-blue">
            Login
          </Link>
          <Link href="/resident/register" className="btn-agency btn-blue">
            Register Resident
          </Link>
            <Link href="/register" className="btn-agency btn-blue">
            Register
          </Link>
        </div>
      </div>

      {/* Full-width footer */}
      <footer className="z-20 w-full bg-green-900/90 text-white text-center py-3 text-sm">
        © {new Date().getFullYear()} Barangay Management System
      </footer>

      <style>{`
        /* Slow pulsing emblem */
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.6)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(255,255,255,0.9)); }
        }

        /* glowing effect for emblem (no border now) */
        .glow-border {
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4);
          padding: 8px;
          background-color: rgba(255,255,255,0.05);
        }

        /* Animated gradient overlay */
        .animated-bg {
          background: linear-gradient(-45deg, rgba(255,255,255,0.5), rgba(0,128,64,0.2), rgba(255,255,255,0.5), rgba(0,128,64,0.2));
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
          mix-blend-mode: lighten;
        }
        @keyframes gradientMove {
          0% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
          100% {background-position:0% 50%;}
        }

        /* Moving background image */
        .animate-bg-move {
          background-size: 110% 110%;
          animation: bg-move 40s ease-in-out infinite;
        }
        @keyframes bg-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Buttons with glow */
        .btn-agency {
          position: relative;
          padding: 0.85rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: buttonPulse 6s ease-in-out infinite;
          background-size: 200% 200%;
          background-position: 0% 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
        .btn-blue {
          background-image: linear-gradient(45deg,#1e3a8a,#3b82f6);
        }
        .btn-green {
          background-image: linear-gradient(45deg,#065f46,#16a34a);
        }

        @keyframes buttonPulse {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(255,255,255,0.2); }
          50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(255,255,255,0.4); }
          100% { transform: scale(1); box-shadow: 0 0 10px rgba(255,255,255,0.2); }
        }

        .btn-agency::after {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.25),
            transparent
          );
          transform: skewX(-20deg);
        }
        .btn-agency:hover::after {
          animation: shine 1s;
        }
        .btn-agency:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px rgba(255,255,255,0.6);
          background-position: 100% 50%;
        }
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
      `}</style>
    </div>
  );
}
