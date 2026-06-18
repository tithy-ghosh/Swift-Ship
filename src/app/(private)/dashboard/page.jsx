export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf5] px-5 py-10 text-[#1f2a1d]">
      <section className="mx-auto max-w-5xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">
          Private dashboard
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Welcome to SwiftShip dashboard</h1>
        <p className="max-w-2xl text-[#596257]">
          This page is protected. Only signed-in users can view it.
        </p>
      </section>
    </main>
  )
}
