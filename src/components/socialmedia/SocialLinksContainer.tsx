import React, {Component} from "react";
import {SocialLink} from "@/data/socialLinks";
import SocialLinkItem from "@/components/socialmedia/SocialLinkItem";

interface SocialLinksProps {
  socialLinks: SocialLink[];
}

class SocialLinksContainer extends Component<SocialLinksProps> {
  constructor(props: SocialLinksProps) {
    super(props);
  }

  render() {
    return (
      <div className="mt-8 flex items-center justify-center space-x-3">
        {this.props.socialLinks.map((link, index) => (
          <SocialLinkItem key={index} link={link}/>
        ))}
      </div>
    );
  }
}

export default SocialLinksContainer;
