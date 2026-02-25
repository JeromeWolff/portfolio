import { Briefcase, Code2, FolderKanban, Mail, User } from 'lucide-react';
import React from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Code2 },
  { label: 'Projects', href: '#projects', icon: FolderKanban },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Contact', href: '#contact', icon: Mail },
] as const;

export const Header: React.FC = React.memo(() => {
  return (
    <header className="site-header" role="banner">
      <div className="site-header-inner">
        <a href="#hero" className="site-header-logo" aria-label="Jerome Wolff - Home">
          Jerome Wolff
        </a>
        <nav className="site-header-nav" aria-label="Main navigation">
          <ul className="site-header-list">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <a href={href} className="site-header-link">
                  <Icon size={16} aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
});
