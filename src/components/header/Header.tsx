import {Component} from "react";
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
      <Navbar brand={this.props.brand} navLinks={this.props.navLinks} />
    );
  }
}

export default Header;
