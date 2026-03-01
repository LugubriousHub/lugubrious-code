'use client';

import Link from 'next/link';
import { Bell, ChevronDown, HeartHandshake, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import LanguageSwitch from './LanguageSwitch';
import { useLanguage } from './LanguageProvider';
import { copy } from '../app/lib/translations';

export default function InternalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language].internalHeader;
  const isB2B = pathname.startsWith('/b2b');
  const profileHref = isB2B ? '/b2b/profile' : '/profile';
  const settingsHref = isB2B ? '/b2b/settings' : '/settings';

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const selectedNotifications = isB2B ? t.notifications : t.familyNotifications;

  const [notificationsState, setNotificationsState] = useState(
    selectedNotifications.map((item) => ({ ...item, read: false }))
  );

  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    setNotificationsState((prev) => {
      const readMap = new Map(prev.map((item) => [item.id, item.read]));
      return selectedNotifications.map((item) => ({
        ...item,
        read: readMap.get(item.id) ?? false
      }));
    });
  }, [selectedNotifications]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const unreadCount = useMemo(
    () => notificationsState.filter((item) => !item.read).length,
    [notificationsState]
  );

  const openNotification = (id) => {
    setNotificationsState((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const handleSignOut = () => {
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#020617]/90 backdrop-blur">
      <div className="mx-auto grid w-[95%] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 py-3">
        <Link href={isB2B ? '/b2b/dashboard' : '/consumer/dashboard'} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/[0.04]">
            <HeartHandshake className="h-4 w-4 text-sky-300" />
          </span>
          <span className="text-lg font-semibold text-white">Lugubrious Hub</span>
        </Link>

        <div className="hidden justify-center md:flex">
          <label className="inline-flex w-full max-w-xl items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2">
          <LanguageSwitch />

          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              aria-label={t.notificationsAria}
              onClick={() => {
                setNotificationsOpen((prev) => !prev);
                setMenuOpen(false);
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.1]"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-sky-500 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 mt-2 w-[300px] rounded-2xl border border-white/10 bg-[#08112a]/95 p-2 shadow-xl backdrop-blur">
                <p className="px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-400">
                  {t.notificationsTitle}
                </p>
                <div className="max-h-72 space-y-1 overflow-y-auto">
                  {notificationsState.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openNotification(item.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left transition hover:bg-white/[0.08] ${
                        item.read
                          ? 'border-white/10 bg-white/[0.02] opacity-55'
                          : 'border-sky-300/30 bg-sky-500/[0.08] opacity-100'
                      }`}
                    >
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-300">{item.detail}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label={t.avatarAria}
              onClick={() => {
                setMenuOpen((prev) => !prev);
                setNotificationsOpen(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-sm text-slate-200 hover:bg-white/[0.1]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-xs font-semibold text-white">
                MC
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-[#08112a]/95 p-2 shadow-xl backdrop-blur">
                <Link
                  href={profileHref}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/[0.08]"
                >
                  {t.menuProfile}
                </Link>
                <Link
                  href={settingsHref}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/[0.08]"
                >
                  {t.menuSettings}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/[0.08]"
                >
                  {t.menuSignOut}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
