import React, {useEffect, useState} from "react";
import {NavLink} from "@/data/navLinks";
import NavbarBranding from "@/components/navbar/NavbarBranding";
import NavbarMenuButton from "@/components/navbar/NavbarMenuButton";
import NavbarNavigation from "@/components/navbar/NavbarNavigation";

interface NavbarProps {
  branding: string;
  navLinks: NavLink[];
}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }
  return (
    <nav
      className="lg:w-auto lg:flex lg:items-center justify-between text-white text-lg font-bold">
      <div className={"hidden lg:block"}>
        <NavbarBranding
          branding={props.branding}/>
      </div>
      <NavbarMenuButton
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}/>
      <NavbarNavigation
        branding={props.branding}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        navLinks={props.navLinks}/>
    </nav>
  );
}

export default Navbar;
