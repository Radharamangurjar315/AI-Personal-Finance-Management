interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

export default function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
