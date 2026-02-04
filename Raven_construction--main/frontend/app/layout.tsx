import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Providers from "./providers";

const themeInitScript = `(() => {
  try {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', useDark);
  } catch (_) {}
})();`;

export const metadata: Metadata = {
  title: "Raven Roofing Owner SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-app">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <div className="min-h-screen flex">
            <Nav />
            <main className="flex-1 p-4 md:p-8 pb-28 md:pb-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
