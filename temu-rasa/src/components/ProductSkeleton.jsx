export function ProductSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col rounded-[1.75rem] bg-white p-2 shadow-card"
    >
      <div className="aspect-[4/3] w-full rounded-[1.35rem] bg-sun-soft" />
      <div className="flex flex-col gap-2 px-3 pb-3 pt-3">
        <div className="h-5 w-3/4 rounded-full bg-sun-soft" />
        <div className="h-3 w-1/2 rounded-full bg-sun-soft" />
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-1/3 rounded-full bg-sun-soft" />
          <div className="h-10 w-10 rounded-full bg-sun-soft" />
        </div>
      </div>
    </div>
  )
}

export default function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div
      role="status"
      aria-label="Memuat menu"
      className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}