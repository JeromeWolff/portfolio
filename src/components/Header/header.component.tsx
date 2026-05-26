import { Briefcase, Code2, FolderKanban, House, Mail, NotebookPen, User } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const homeLinks = [
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Code2 },
  { label: 'Projects', href: '#projects', icon: FolderKanban },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Blog', to: '/blog', icon: NotebookPen },
  { label: 'Contact', href: '#contact', icon: Mail },
] as const;

const blogLinks = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Blog', to: '/blog', icon: NotebookPen },
  { label: 'Contact', href: '/#contact', icon: Mail },
] as const;

export const Header: React.FC = React.memo(() => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const links = isHome ? homeLinks : blogLinks;

  return (
    <header className="site-header" role="banner">
      <div className="site-header-inner">
        {isHome ? (
          <a href="#hero" className="site-header-logo" aria-label="Jerome Wolff - Home">
            Jerome Wolff
          </a>
        ) : (
          <Link to="/" className="site-header-logo" aria-label="Jerome Wolff - Home">
            Jerome Wolff
          </Link>
        )}
        <nav className="site-header-nav" aria-label="Main navigation">
          <ul className="site-header-list">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = 'to' in link && location.pathname === link.to;

              return (
                <li key={link.label}>
                  {'to' in link ? (
                    <Link
                      to={link.to}
                      className={`site-header-link${isActive ? ' site-header-link-active' : ''}`}
                    >
                      <Icon size={16} aria-hidden />
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="site-header-link">
                      <Icon size={16} aria-hidden />
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
});
