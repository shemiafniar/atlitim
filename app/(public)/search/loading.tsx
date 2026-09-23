export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6" aria-busy="true" aria-live="polite">
      <div className="h-8 w-40 animate-pulse rounded-full bg-sand" />
      <div className="mt-4 h-16 w-full max-w-xl animate-pulse rounded-3xl bg-sand" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-sand" />
        ))}
      </div>
    </div>
  );
}
