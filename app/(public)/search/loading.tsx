export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6" aria-busy="true" aria-live="polite">
      <div className="h-10 w-56 animate-pulse rounded-full bg-sand" />
      <div className="mt-4 h-14 w-full max-w-3xl animate-pulse rounded-full bg-sand" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    </div>
  );
}
