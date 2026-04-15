'use client';

import { usePathname } from 'next/navigation';
import SmartChatbot from './SmartChatbot';

// Pages that already have their own chatbot instance in their layout
const EXCLUDED_PREFIXES = ['/b2b', '/consumer', '/dashboard'];

export default function PublicChatbot() {
  const pathname = usePathname();

  const isExcluded = EXCLUDED_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  if (isExcluded) return null;

  return <SmartChatbot mode="generic" />;
}
