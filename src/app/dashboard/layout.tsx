import { AuthGuard } from "@/auth/guard/auth-guard";
import DashboardLayout from "@/layout/dashboard/dashboard-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
};
export default Layout;
