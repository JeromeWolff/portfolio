import React, {Component} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

interface NavItemProps {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const NavItem: React.FC<NavItemProps> = (props: NavItemProps) => {
  return (
    <a
      className="flex items-center text-white hover:text-blue-500"
      href={props.href}>
      <div>
        <props.icon className="h-6 w-6"/>
        <span className="ml-2">{props.label}</span>
      </div>
    </a>
  );
}

export default NavItem;
