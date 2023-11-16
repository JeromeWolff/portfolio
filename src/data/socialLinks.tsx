import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faTwitter, IconDefinition
} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-regular-svg-icons";

interface SocialLink {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const createSocialLink = (name: string, href: string, icon: IconDefinition): SocialLink => ({
  name: name,
  href: href,
  icon: (props) => <FontAwesomeIcon icon={icon} {...props} />,
});

const socialLinks: SocialLink[] = [
  createSocialLink('Email', `mailto:${process.env.NEXT_PUBLIC_SOCIAL_EMAIL}`, faEnvelope),
  createSocialLink('Facebook', process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK, faFacebook),
  createSocialLink('Instagram', process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, faInstagram),
  createSocialLink('Twitter', process.env.NEXT_PUBLIC_SOCIAL_TWITTER, faTwitter),
  createSocialLink('GitHub', process.env.NEXT_PUBLIC_SOCIAL_GITHUB, faGithub),
  createSocialLink('LinkedIn', process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN, faLinkedin),
];

export default socialLinks;