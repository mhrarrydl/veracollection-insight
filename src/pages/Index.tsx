import AppLayout from "@/components/AppLayout";
import DashboardStats from "@/components/DashboardStats";
import SalesChart from "@/components/SalesChart";
import HealthIndicator from "@/components/HealthIndicator";
import RecentTransactions from "@/components/RecentTransactions";

const Index = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan keuangan Veracollection bulan ini</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <HealthIndicator />
        </div>
      </div>

      <div className="mt-4">
        <RecentTransactions />
      </div>
    </AppLayout>
  );
};

export default Index;
