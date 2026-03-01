import './globals.css';
import { LanguageProvider } from '../components/LanguageProvider';

export const metadata = {
  title: 'Lugubrious Hub | Gestione pratiche funerarie',
  description:
    'Suite B2B per agenzie funebri e area consumer per monitoraggio pratiche.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-[#020617] text-slate-100 antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
