import Link from "next/link";

export const NavItem = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
  >
    <Icon className="w-5 h-5 mr-2" />
    {children}
  </Link>
);
