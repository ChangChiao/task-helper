"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ClipboardList, ArrowLeftRight } from "lucide-react";
import { useRole } from "@/lib/role-context";

const posterLinks = [
  { href: "/", label: "瀏覽任務" },
  { href: "/my-tasks", label: "我的任務" },
  { href: "/messages", label: "訊息" },
];

const workerLinks = [
  { href: "/", label: "瀏覽任務" },
  { href: "/my-applications", label: "我的申請" },
  { href: "/messages", label: "訊息" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { role, toggleRole, isPoster } = useRole();
  const navLinks = isPoster ? posterLinks : workerLinks;

  return (
    <header className="bg-white border-b border-[#E5E4E1] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-[#3D8A5A]" />
          <span className="text-lg sm:text-[22px] font-bold tracking-tight">快幫手</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#3D8A5A]"
                  : "text-[#6D6C6A] hover:text-[#1A1918]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* 角色切換 */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5E4E2] text-xs font-medium text-[#6D6C6A] hover:bg-[#F5F4F1] transition-colors"
          >
            <ArrowLeftRight size={14} />
            <span className="hidden sm:inline">{isPoster ? "發案者" : "接案者"}</span>
          </button>

          {isPoster && (
            <Link
              href="/tasks/new"
              className="bg-[#3D8A5A] text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm sm:text-[15px] font-semibold hover:bg-[#357A4E] transition-colors"
            >
              發布任務
            </Link>
          )}

          <Link href="/profile">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#D89575]" />
            )}
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-[#E5E4E1]">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 text-center py-2.5 text-xs font-medium transition-colors ${
              pathname === link.href
                ? "text-[#3D8A5A] border-b-2 border-[#3D8A5A]"
                : "text-[#9C9B99]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
