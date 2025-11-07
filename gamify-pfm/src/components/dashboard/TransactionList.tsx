interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Transactions 📊</h2>
      <div className="space-y-3">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all"
          >
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-sm text-gray-300">{t.date}</p>
            </div>
            <p className={`font-bold ${t.amount < 0 ? "text-red-400" : "text-green-400"}`}>
              {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
