import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import ThemeProvider from "@/lib/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Challenge Me",
  description: "Take challenges, achieve goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
