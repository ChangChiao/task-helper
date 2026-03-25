import type { Metadata } from "next";
import SessionProvider from "@/components/providers/SessionProvider";
import { RoleProvider } from "@/lib/role-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "快幫手 - 生活任務媒合平台",
  description: "找人幫忙？還是想接案賺外快？快幫手是你的生活任務媒合平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F5F4F1] text-[#1A1918]">
        <SessionProvider><RoleProvider>{children}</RoleProvider></SessionProvider>
      </body>
    </html>
  );
}
