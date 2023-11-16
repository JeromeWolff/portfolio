import React from "react";
import Link from "next/link";
import NavItem from "@/components/navbar/NavItem";
import {NavLink} from "@/data/navLinks";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  brand: string;
  navLinks: NavLink[];
}

class Navbar extends React.Component<NavbarProps> {
  constructor(props: NavbarProps) {
    super(props);
  }

  render() {
    return (
      <nav className="bg-gray-900 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <a className="text-white text-xl font-bold flex items-center">
              <FontAwesomeIcon icon={faHome} className="mr-2"/>
              {this.props.brand}
            </a>
          </Link>
          <div className="flex space-x-4">
            {this.props.navLinks.map((link: NavLink, index: number) => (
              <NavItem key={index} label={link.label} href={link.href}
                       icon={link.icon}/>
            ))}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
