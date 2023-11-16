import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-regular-svg-icons";
import {faHome, faLegal} from "@fortawesome/free-solid-svg-icons";

export interface NavLink {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

export const createSimpleNavLink = (label: string, href: string, icon: IconDefinition): NavLink => (
  createNavLink(label, href, (props) => <FontAwesomeIcon icon={icon} {...props} />)
);

export const createNavLink = (label: string, href: string, icon: React.FC<{
  className?: string
}>): NavLink => ({
  label: label,
  href: href,
  icon: icon,
});

const navLinks: NavLink[] = [
  createSimpleNavLink('home', "/", faHome),
  createSimpleNavLink('contact', "/contact", faEnvelope),
  createSimpleNavLink('imprint', "/imprint", faLegal),
];

export default navLinks;