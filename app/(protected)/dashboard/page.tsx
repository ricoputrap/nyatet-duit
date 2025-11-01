export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Nyatet Duit - Your personal money manager
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for dashboard content */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Total Balance</h3>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">This Month Expenses</h3>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">This Month Income</h3>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
      </div>
    </div>
  );
}
