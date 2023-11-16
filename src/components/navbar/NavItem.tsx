import React, {Component} from "react";
import Link from "next/link";

interface NavItemProps {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

class NavItem extends Component<NavItemProps> {
  constructor(props: NavItemProps) {
    super(props);
  }

  render() {
    return (
      <Link href={this.props.href}>
        <a className="flex items-center text-white hover:text-blue-500">
          <span className="mr-2">{this.props.label}</span>
          <this.props.icon className="h-6 w-6"/>
        </a>
      </Link>
    );
  }
}

export default NavItem;
