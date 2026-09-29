import Link from "next/link";

export function Logo({ variant = "header", className = "" }: { variant?: "header" | "footer"; className?: string }) {
  if (variant === "footer") {
    return (
      <Link href="/" className={`inline-flex max-w-full items-center ${className}`}>
        <img src="/brand/logos/atlitim-logo.svg" alt="Atlitim, כל עתלית במקום אחד" className="h-16 w-auto max-w-full sm:h-20" />
      </Link>
    );
  }
  return (
    <Link href="/" className={`inline-flex max-w-full items-center ${className}`}>
      <img src="/brand/logos/atlitim-mark.svg" alt="Atlitim" className="h-10 w-10 lg:hidden" />
      <img src="/brand/logos/atlitim-logo-horizontal.svg" alt="Atlitim, כל עתלית במקום אחד" className="hidden h-11 w-auto max-w-full lg:block" />
    </Link>
  );
}

export function Wordmark() {
  return <Logo />;
}
