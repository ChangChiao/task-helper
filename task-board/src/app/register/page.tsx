"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call register API
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand */}
      <div className="hidden lg:flex flex-1 bg-[#3D8A5A] flex-col items-center justify-center gap-4">
        <ClipboardList className="w-16 h-16 text-white" />
        <h1 className="text-[32px] font-bold text-white tracking-tight">
          快幫手
        </h1>
        <p className="text-white/80 text-base">你的生活任務媒合平台</p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-16 bg-[#F5F4F1]">
        <div className="w-full max-w-[400px] space-y-6">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight">建立帳號</h2>
            <p className="text-[15px] text-[#6D6C6A] mt-1">
              註冊後即可開始發案或接案
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的姓名"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors placeholder:text-[#9C9B99]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors placeholder:text-[#9C9B99]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">密碼</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 8 個字元"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E4E1] bg-white text-[15px] outline-none focus:border-[#3D8A5A] transition-colors placeholder:text-[#9C9B99]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#3D8A5A] text-white py-3 rounded-xl text-base font-semibold hover:bg-[#357A4E] transition-colors"
            >
              註冊
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E5E4E1]" />
            <span className="text-[13px] text-[#9C9B99] font-medium">或</span>
            <div className="flex-1 h-px bg-[#E5E4E1]" />
          </div>

          <button className="w-full border border-[#D1D0CD] bg-white py-3 rounded-xl text-[15px] font-semibold hover:bg-[#FAFAF8] transition-colors">
            使用 Google 帳號註冊
          </button>

          <p className="text-center text-sm text-[#6D6C6A]">
            已有帳號？
            <Link
              href="/login"
              className="text-[#3D8A5A] font-medium hover:underline"
            >
              登入
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
