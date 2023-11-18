import React, {Component} from "react";
import {NavLink} from "@/data/navLinks";
import Navbar from "@/components/navbar/Navbar";

interface HeaderProps {
  brand: string;
  navLinks: NavLink[];
}

class Header extends Component<HeaderProps> {
  constructor(props: HeaderProps) {
    super(props);
  }

  render() {
    return (
      <header className="top-0 p-4 bg-gray-950">
        <div className="container mx-auto flex items-center justify-between">
          <Navbar
            branding={this.props.brand}
            navLinks={this.props.navLinks}/>
        </div>
      </header>
    );
  }
}

export default Header;
