import React, {Component} from "react";
import {SocialLink} from "@/data/socialLinks";
import Link from "next/link";

interface SocialLinkItemProps {
  link: SocialLink;
}

class SocialLinkItem extends Component<SocialLinkItemProps> {
  constructor(props: SocialLinkItemProps) {
    super(props);
  }

  render() {
    return (
      <Link
        href={this.props.link.href}
        className="text-white hover:text-blue-500">
        <div>
          <p className="sr-only">{this.props.link.name}</p>
          {React.createElement(this.props.link.icon, {className: "h-8 w-8"})}
        </div>
      </Link>
    );
  }
}

export default SocialLinkItem;
