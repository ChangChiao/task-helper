"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Loader2 } from "lucide-react";

type UserProfile = {
  name: string;
  bio: string;
  avatarUrl: string | null;
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({ name: "", bio: "", avatarUrl: null });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile({ name: data.name || "", bio: data.bio || "", avatarUrl: data.avatarUrl });
        if (data.avatarUrl) setAvatarPreview(data.avatarUrl);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let avatarUrl = profile.avatarUrl;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        avatarUrl = uploadData.url;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, bio: profile.bio, avatarUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#9C9B99]" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-6">編輯個人資料</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] space-y-5">
          {/* 頭像 */}
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              {avatarPreview ? (
                <img src={avatarPreview} alt="頭像" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#D89575] flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name?.[0] || "?"}
                </div>
              )}
            </label>
            <p className="text-sm text-[#9C9B99]">點擊頭像更換照片</p>
          </div>

          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium mb-1.5">姓名</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="w-full border border-[#E5E4E2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#3D8A5A]"
            />
          </div>

          {/* 自我介紹 */}
          <div>
            <label className="block text-sm font-medium mb-1.5">自我介紹</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              className="w-full border border-[#E5E4E2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#3D8A5A] resize-none"
              placeholder="介紹一下自己..."
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white border border-[#E5E4E2] py-3 rounded-xl font-semibold hover:bg-[#F5F4F1] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#3D8A5A] text-white py-3 rounded-xl font-semibold hover:bg-[#356F4A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 className="animate-spin" size={18} />儲存中...</> : "儲存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
