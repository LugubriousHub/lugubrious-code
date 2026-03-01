'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitch from '../../components/LanguageSwitch';
import { useLanguage } from '../../components/LanguageProvider';

function isActive(pathname, href) {
  if (href === '/dashboard') return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function WorkspaceShell({ children }) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const navGroups = [
    {
      title: language === 'it' ? 'Panoramica' : 'Overview',
      items: [{ href: '/dashboard', label: language === 'it' ? 'Dashboard Hub' : 'Hub Dashboard' }]
    },
    {
      title: language === 'it' ? 'Moduli Agenzia' : 'Agency Modules',
      items: [
        { href: '/b2b/dashboard', label: language === 'it' ? 'Cruscotto' : 'Dashboard' },
        { href: '/b2b/burocrazia', label: language === 'it' ? 'Burocrazia' : 'Bureaucracy' },
        { href: '/b2b/logistica', label: language === 'it' ? 'Logistica' : 'Logistics' },
        { href: '/b2b/preventivi', label: language === 'it' ? 'Preventivi' : 'Quotes' },
        { href: '/b2b/fornitori', label: language === 'it' ? 'Fornitori' : 'Suppliers' },
        { href: '/b2b/necrologi', label: language === 'it' ? 'Necrologi' : 'Obituaries' }
      ]
    },
    {
      title: language === 'it' ? 'Esperienza Famiglia' : 'Family Experience',
      items: [
        {
          href: '/consumer/dashboard',
          label: language === 'it' ? 'Dashboard Famiglia' : 'Family Dashboard'
        }
      ]
    }
  ];

  return (
    <div className="app-shell min-h-screen text-slate-800">
      <div className="mx-auto w-[95%] max-w-7xl py-6">
        <header className="surface mb-4 p-3 md:p-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between rounded-full border border-slate-200 bg-[#f8f7f5] px-4 py-2">
            <div className="text-lg font-semibold">Lugubrious Hub</div>
            <nav className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
              <Link href="/dashboard" className="hover:text-slate-900">
                {language === 'it' ? 'Dashboard' : 'Dashboard'}
              </Link>
              <Link href="/b2b/dashboard" className="hover:text-slate-900">
                {language === 'it' ? 'Agenzie' : 'Agencies'}
              </Link>
              <Link href="/consumer/dashboard" className="hover:text-slate-900">
                {language === 'it' ? 'Famiglie' : 'Families'}
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSwitch />
              <Link
                href="/login"
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium hover:bg-slate-100"
              >
                {language === 'it' ? 'Accedi' : 'Log in'}
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="surface h-fit p-4 lg:sticky lg:top-6">
            {navGroups.map((group) => (
              <div key={group.title} className="mb-5 last:mb-0">
                <p className="mb-2 px-2 text-xs uppercase tracking-[0.18em] text-slate-500">{group.title}</p>
                <nav className="grid gap-1.5">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? 'border border-slate-900 bg-slate-900 text-white'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {language === 'it' ? 'Torna alla landing' : 'Back to landing'}
              </Link>
            </div>
          </aside>

          <main className="surface p-5 md:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
