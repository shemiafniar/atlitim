import Link from "next/link";

export function Wordmark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-olive font-display text-lg font-bold text-white">א</span>
      <span className="font-display text-[1.7rem] font-bold leading-none tracking-tight text-olive">Atlitim</span>
    </Link>
  );
}
