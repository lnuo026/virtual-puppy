import { useState } from "react";
import { loginUrl } from "../api/auth";
import Icon from "../components/Icon";

export default function LoginPage() {
  const [redirecting, setRedirecting] = useState(false);

  const handleLogin = () => {
    setRedirecting(true);
    window.location.href = loginUrl;
  };

  return (
    <main className="grid min-h-screen bg-[#f7f4ee] lg:grid-cols-[minmax(420px,0.85fr)_minmax(540px,1.15fr)]">
      <section className="flex flex-col justify-between px-6 py-7 sm:px-12 sm:py-10 lg:px-16">
        <div className="flex items-center gap-3 text-stone-800">
          <Icon name="paw" className="size-8 text-[#b9573a]" />
          <span className="text-xl font-semibold tracking-[-0.02em]">Virtual Puppy</span>
        </div>

        <div className="mx-auto my-16 w-full max-w-md lg:my-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#a94f35]">Your everyday companion</p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-stone-800 sm:text-5xl">
            A small friend who remembers you.
          </h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-stone-500">
            Feed, play, rest, and talk together. Your puppy grows with every visit and stays with you across devices.
          </p>

          <button
            onClick={handleLogin}
            disabled={redirecting}
            className="mt-9 flex w-full items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white px-5 py-3.5 text-sm font-medium text-stone-700 shadow-[0_1px_2px_rgb(47_41_37/0.05)] transition hover:border-stone-400 hover:bg-[#fdfcf9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a94f35] disabled:text-stone-400"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z" />
              <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.38l-3.24-2.53c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z" />
              <path fill="#FBBC05" d="M6.39 13.92A6 6 0 0 1 6.07 12c0-.67.11-1.32.32-1.92V7.47H3.04A10 10 0 0 0 2 12c0 1.61.38 3.13 1.04 4.53l3.35-2.61Z" />
              <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.47l3.35 2.61C7.18 7.71 9.39 5.95 12 5.95Z" />
            </svg>
            {redirecting ? "Taking you to Google..." : "Continue with Google"}
          </button>
          <p className="mt-4 text-center text-xs leading-5 text-stone-400">
            Sign in to safely keep your puppy's progress in sync.
          </p>
        </div>

        <p className="text-xs text-stone-400">A quiet place to check in, care, and connect.</p>
      </section>

      <section className="relative hidden overflow-hidden border-l border-stone-300/70 bg-[#e9e1d4] lg:block" aria-label="A puppy waiting at home">
        <div className="absolute inset-x-0 bottom-0 h-[36%] border-t border-stone-400/20 bg-[#d1b998]/55" />
        <div className="absolute left-[11%] top-[14%] h-64 w-36">
          <div className="absolute bottom-0 left-10 h-44 w-16 rounded-[60%_35%_20%_20%] bg-[#6e8062]" />
          <div className="absolute bottom-24 left-0 h-24 w-12 rotate-[-28deg] rounded-[90%_20%] bg-[#738a68]" />
          <div className="absolute bottom-32 right-2 h-28 w-12 rotate-[28deg] rounded-[20%_90%] bg-[#647b5d]" />
          <div className="absolute bottom-0 left-5 h-16 w-28 rounded-t-[45%] bg-[#b8a28a]" />
        </div>
        <div className="absolute right-[13%] top-[13%] rounded-xl border border-stone-700/10 bg-[#f7f4ee]/75 px-5 py-4 backdrop-blur-sm">
          <p className="text-sm font-medium text-stone-700">Someone is waiting.</p>
          <p className="mt-1 text-xs text-stone-500">Come say hello.</p>
        </div>
        <div className="absolute bottom-[17%] left-1/2 -translate-x-1/2 text-[#a94f35]">
          <div className="relative grid size-52 place-items-center rounded-[45%_45%_42%_42%] bg-[#c99a6b] shadow-[0_24px_50px_rgb(64_44_30/0.18)]">
            <div className="absolute -left-9 top-3 h-24 w-16 rotate-[18deg] rounded-[70%_30%_55%_45%] bg-[#ac7e54]" />
            <div className="absolute -right-9 top-3 h-24 w-16 rotate-[-18deg] rounded-[30%_70%_45%_55%] bg-[#ac7e54]" />
            <div className="absolute left-12 top-20 size-3 rounded-full bg-stone-800" />
            <div className="absolute right-12 top-20 size-3 rounded-full bg-stone-800" />
            <div className="absolute top-28 h-8 w-11 rounded-[50%] bg-[#77523a]" />
            <Icon name="paw" className="absolute -bottom-16 size-14 text-[#a94f35]/30" />
          </div>
        </div>
      </section>
    </main>
  );
}
