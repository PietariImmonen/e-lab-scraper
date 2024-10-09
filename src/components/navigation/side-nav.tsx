import { LayoutDashboard } from "lucide-react";
import { NavItem } from "./nav-item";
import { paths } from "@/routes/paths";

export const Sidebar = ({ isMobile = false }) => (
  <nav
    className={`${
      isMobile ? "lg:hidden" : "hidden lg:block"
    } w-64 h-full bg-white border-r border-gray-200`}
  >
    <div className="h-full px-3 py-4 overflow-y-auto">
      <ul className="space-y-2 font-medium">
        <li>
          <NavItem href={paths.dashboard.root} icon={LayoutDashboard}>
            Dashboard
          </NavItem>
        </li>
      </ul>
    </div>
  </nav>
);
