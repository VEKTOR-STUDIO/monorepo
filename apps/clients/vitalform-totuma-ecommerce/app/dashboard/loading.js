export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] p-4 md:p-6 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div
          className="h-32 rounded-2xl border border-[#C69C6D]/20 animate-pulse"
          style={{ backgroundColor: "#222222" }}
        />
        <div
          className="h-64 rounded-2xl border border-[#C69C6D]/20 animate-pulse bg-[#222222]/80"
          style={{ boxShadow: "0 0 40px rgba(198, 156, 109, 0.08)" }}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-xl bg-[#222222] border border-[#C69C6D]/20 animate-pulse" />
          <div className="h-24 rounded-xl bg-[#222222] border border-[#C69C6D]/20 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
