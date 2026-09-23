"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-4xl font-bold">משהו השתבש</h1>
      <p className="mt-3 text-base leading-7 text-muted">לא הצלחנו לטעון את העמוד. אפשר לנסות שוב.</p>
      <button type="button" onClick={reset} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-olive px-5 font-semibold text-white">
        נסו שוב
      </button>
    </main>
  );
}
