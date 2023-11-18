import React, {Component, MouseEventHandler} from "react";
import NavItem from "@/components/navbar/NavItem";
import {NavLink} from "@/data/navLinks";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NavbarBranding from "@/components/navbar/NavbarBranding";

interface NavbarNavigationProps {
  branding: string;
  menuOpen: boolean;
  toggleMenu: MouseEventHandler,
  navLinks: NavLink[];
}

class NavbarNavigation extends Component<NavbarNavigationProps> {
  constructor(props: NavbarNavigationProps) {
    super(props);
  }

  render() {
    return (
      <>
        <DesktopNavbarNavigation
          branding={this.props.branding}
          menuOpen={this.props.menuOpen}
          toggleMenu={this.props.toggleMenu}
          navLinks={this.props.navLinks}/>
        <MobileNavbarNavigation
          branding={this.props.branding}
          menuOpen={this.props.menuOpen}
          toggleMenu={this.props.toggleMenu}
          navLinks={this.props.navLinks}/>
      </>
    );
  }
}

class DesktopNavbarNavigation extends Component<NavbarNavigationProps> {
  constructor(props: NavbarNavigationProps) {
    super(props);
  }

  render() {
    return (
      <div className="hidden absolute lg:flex right-10 space-x-4">
        {this.props.navLinks.map((link, index) => (
          <NavItem key={index} label={link.label} href={link.href}
                   icon={link.icon}/>
        ))}
      </div>
    );
  }
}

class MobileNavbarNavigation extends Component<NavbarNavigationProps> {
  constructor(props: NavbarNavigationProps) {
    super(props);
  }

  render() {
    return (this.props.menuOpen && (
      <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-10">
        <div className="p-4 flex justify-end">
          <button onClick={this.props.toggleMenu}>
            <FontAwesomeIcon icon="times" className="text-white"/>
          </button>
        </div>
        <div className="mt-4 mr-4 px-4 lg:mt-0 h-full flex flex-col items-center">
          <br/>
          {this.props.navLinks.map((link, index) => (
            <NavItem key={index} label={link.label} href={link.href}
                     icon={link.icon}/>
          ))}
        </div>
      </div>
    ));
  }
}

export default NavbarNavigation;
