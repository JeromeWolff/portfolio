import { type LucideIcon, Github, Globe, Linkedin, Mail } from 'lucide-react';

export interface SocialLinkConfig {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const socialConfig = {
  socialLinks: [
    { label: 'Website', href: 'https://www.jeromewolff.de', icon: Globe },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jerome-wolff', icon: Linkedin },
    { label: 'Email', href: 'mailto:hello@jeromewolff.de', icon: Mail },
    { label: 'GitHub', href: 'https://github.com/JeromeWolff', icon: Github },
  ] as const satisfies readonly SocialLinkConfig[],
};
