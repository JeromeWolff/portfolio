import React, {Component} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

interface NavbarBrandingProps {
  branding: string;
}

class NavbarBranding extends Component<NavbarBrandingProps> {
  constructor(props: NavbarBrandingProps) {
    super(props);
  }

  render() {
    return (
      <div className={"hidden lg:block"}>
        <Link href="/">
          <FontAwesomeIcon icon={faHome} className="mr-2"/>
          {this.props.branding}
        </Link>
      </div>
    );
  }
}

export default NavbarBranding;
