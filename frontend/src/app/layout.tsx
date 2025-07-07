import type { Metadata } from "next";
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import ThemeProvider from "@/lib/providers/ThemeProvider";
import { Box } from "@mui/material";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body style={{ margin: 0 }}>
        <ThemeProvider>
          <AuthProvider>
            <Box component="main" sx={{ minHeight: '100vh' }}>
              <Header />
              {children}
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
