import React, {Component, MouseEventHandler} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons";

interface NavbarMenuIconProps {
  menuOpen: boolean;
  toggleMenu: MouseEventHandler;
}

class NavbarMenuButton extends Component<NavbarMenuIconProps> {
  constructor(props: NavbarMenuIconProps) {
    super(props);
  }

  render() {
    return (
      <div className="ml-auto lg:hidden right-10 z-50">
        <button
          className="button"
          onClick={this.props.toggleMenu}>
          {this.props.menuOpen ?
            <FontAwesomeIcon icon={faTimes}/> :
            <FontAwesomeIcon icon={faBars}/>
          }
        </button>
      </div>
    );
  }
}

export default NavbarMenuButton;
