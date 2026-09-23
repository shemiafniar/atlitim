import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center rounded-xl ${className}`}>
      <img src="/images/atlitim-logo.png" alt="Atlitim, כל עתלית במקום אחד" className="h-11 w-auto sm:h-14" />
    </Link>
  );
}

export function Wordmark() {
  return <Logo />;
}
