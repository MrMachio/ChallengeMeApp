import type { Metadata } from "next";
import Header from "@/components/Header";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";
import ThemeProvider from "@/lib/providers/ThemeProvider";
import { Box } from "@mui/material";

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
          <ReduxProvider>
            <AuthProvider>
              <Box component="main" sx={{ minHeight: '100vh' }}>
                <Header />
                {children}
              </Box>
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
