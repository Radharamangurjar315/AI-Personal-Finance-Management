export default function DashboardHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight">Welcome to Your Wealthy Dashboard 💸</h1>
      <button className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold backdrop-blur-md transition-all shadow-lg">
        + Add Transaction
      </button>
    </header>
  );
}
