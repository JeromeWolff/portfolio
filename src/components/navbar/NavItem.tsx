import React from "react";
import Link from "next/link";

interface NavItemProps {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const NavItem: React.FC<NavItemProps> = (props: NavItemProps) => {
  return (
    <Link
      href={props.href}
      className="block lg:inline-block hover:text-blue-500 transition-all">
      {React.createElement(props.icon, {className: "mr-2"})}
      {props.label}
    </Link>
  );
}

export default NavItem;
