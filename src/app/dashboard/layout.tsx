import { AuthGuard } from "@/auth/guard/auth-guard";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};
export default Layout;
