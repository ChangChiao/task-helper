"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { ShieldCheck, Upload, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

type VerificationState = {
  verificationStatus: "none" | "pending" | "verified" | "rejected";
  verificationNote: string | null;
};

export default function VerificationPage() {
  const [state, setState] = useState<VerificationState | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/verification")
      .then((r) => r.json())
      .then(setState)
      .catch(() => setError("無法取得認證狀態"));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      // 上傳圖片至 Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error);

      // 提交認證
      const verifyRes = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentUrl: uploadData.url }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) throw new Error(verifyData.error);

      setState((prev) => prev ? { ...prev, verificationStatus: "pending" } : prev);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  };

  const statusConfig = {
    none: { icon: ShieldCheck, color: "text-[#9C9B99]", bg: "bg-[#F0EFED]", label: "尚未認證" },
    pending: { icon: Clock, color: "text-[#B8860B]", bg: "bg-[#FFF8E1]", label: "審核中" },
    verified: { icon: CheckCircle, color: "text-[#3D8A5A]", bg: "bg-[#C8F0D8]", label: "已認證" },
    rejected: { icon: XCircle, color: "text-[#D32F2F]", bg: "bg-[#FFE0E0]", label: "認證被拒絕" },
  };

  const currentStatus = state ? statusConfig[state.verificationStatus] : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-6">實名認證</h1>

        {/* 目前狀態 */}
        {currentStatus && (
          <div className={`${currentStatus.bg} rounded-2xl p-5 mb-6 flex items-center gap-3`}>
            <currentStatus.icon className={currentStatus.color} size={22} />
            <div>
              <p className={`font-semibold ${currentStatus.color}`}>{currentStatus.label}</p>
              {state?.verificationNote && (
                <p className="text-sm text-[#6D6C6A] mt-1">{state.verificationNote}</p>
              )}
            </div>
          </div>
        )}

        {/* 上傳表單 - 僅 none 或 rejected 可重新提交 */}
        {state && (state.verificationStatus === "none" || state.verificationStatus === "rejected") && (
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] space-y-5">
            <p className="text-sm text-[#6D6C6A]">
              請上傳身分證件正面照片（身分證、駕照或護照），我們將在 1-3 個工作天內完成審核。
            </p>

            <label className="block border-2 border-dashed border-[#D5D4D2] rounded-xl p-8 text-center cursor-pointer hover:border-[#3D8A5A] transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview ? (
                <img src={preview} alt="預覽" className="max-h-48 mx-auto rounded-lg" />
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto text-[#9C9B99]" size={32} />
                  <p className="text-sm text-[#9C9B99]">點擊選擇圖片或拖曳上傳</p>
                </div>
              )}
            </label>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="w-full bg-[#3D8A5A] text-white py-3 rounded-xl font-semibold hover:bg-[#356F4A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  上傳中...
                </>
              ) : (
                "提交認證"
              )}
            </button>
          </div>
        )}

        {state?.verificationStatus === "pending" && (
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] text-center text-sm text-[#6D6C6A]">
            您的認證申請正在審核中，請耐心等候。
          </div>
        )}

        {state?.verificationStatus === "verified" && (
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,25,24,0.03)] text-center text-sm text-[#6D6C6A]">
            您已完成實名認證，可以開始發布和接取任務！
          </div>
        )}
      </div>
    </div>
  );
}
