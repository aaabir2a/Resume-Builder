import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { CVProvider } from "@/context/cv-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CV Builder",
  description: "Build and manage your CV online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CVProvider>{children}</CVProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
