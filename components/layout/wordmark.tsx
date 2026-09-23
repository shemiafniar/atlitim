import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 rounded-xl ${className}`}>
      <Fortress className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <span className="flex min-w-0 flex-col items-start">
        <span className="font-wordmark text-[1.45rem] font-bold leading-none tracking-tight text-olive sm:text-[1.7rem]">Atlitim</span>
        <svg viewBox="0 0 128 12" className="mt-1 h-2 w-16 text-aqua" aria-hidden="true">
          <path
            d="M2 7c12 5 18-6 30-1s18 6 30 1 18-6 30-1 16 5 28 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span className="mt-1 text-[10px] font-semibold leading-none text-olive/80 sm:text-[11px]">כל עתלית במקום אחד</span>
      </span>
    </Link>
  );
}

export function Wordmark() {
  return <Logo />;
}

function Fortress({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#0c4e4f"
        d="M9 40.5V22.5h4.4V18h3.5v4.5h3.6V18h3.5v4.5h3.6V18H32v4.5h4.4v18H9zm10.2-2.6h4.2v-7.2h-4.2v7.2z"
      />
      <path
        d="M6 42.2c6 3.4 9.6-2.8 15.2 0 5.2 2.6 9.2-3.4 14.6-.2 4.8 2.8 8.2-1.4 12.2.4"
        fill="none"
        stroke="#2a9d96"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
