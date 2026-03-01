'use client';

import Link from 'next/link';
import {
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  ReceiptText,
  Route,
  Sparkles
} from 'lucide-react';
import SmartChatbot from '../../components/SmartChatbot';
import InternalHeader from '../../components/InternalHeader';
import { useLanguage } from '../../components/LanguageProvider';
import { usePathname } from 'next/navigation';
import { copy } from '../lib/translations';

export default function B2BLayout({ children }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const t = copy[language].b2bLayout;

  const b2bLinks = [
    { href: '/b2b/dashboard', label: t.links.dashboard, icon: LayoutDashboard },
    { href: '/b2b/burocrazia', label: t.links.burocrazia, icon: FileCheck2 },
    { href: '/b2b/logistica', label: t.links.logistica, icon: Route },
    { href: '/b2b/preventivi', label: t.links.preventivi, icon: ReceiptText },
    { href: '/b2b/fornitori', label: t.links.fornitori, icon: ClipboardList },
    { href: '/b2b/necrologi', label: t.links.necrologi, icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <InternalHeader />
      <div className="mx-auto grid w-[95%] max-w-7xl gap-4 pb-6 pt-24 lg:grid-cols-[220px_1fr]">
        <aside className="surface h-fit p-4 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{t.area}</p>
          <h1 className="mt-2 text-xl">Lugubrious Hub</h1>

          <nav className="mt-4 grid gap-1.5">
            {b2bLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition ${
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? 'border border-sky-300/50 bg-sky-400/[0.12] text-white'
                    : 'border border-white/10 bg-white/[0.03] text-slate-200 hover:border-sky-400/40 hover:bg-white/[0.08]'
                }`}
              >
                <item.icon className="h-3.5 w-3.5 text-sky-300" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-white/10 pt-4 text-sm">
            <Link href="/login/b2b" className="text-slate-300 hover:text-white">
              {t.switchAccount}
            </Link>
          </div>
        </aside>

        <main className="surface p-5 md:p-7">{children}</main>
      </div>
      <SmartChatbot mode="agency" />
    </div>
  );
}
