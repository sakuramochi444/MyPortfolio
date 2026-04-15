"use client";

import { useEffect, useState } from "react";
import { getSession, logout } from "@/lib/auth";
import { updateAboutData, updateWorksData, getAllData } from "@/lib/data-actions";
import { useRouter } from "next/navigation";
import AboutEditor from "@/components/Admin/AboutEditor";
import WorksEditor from "@/components/Admin/WorksEditor";
import { AboutData, WorkItem } from "@/types";

export const runtime = "edge";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"about" | "works">("about");
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ about: AboutData; works: WorkItem[] } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Add class to body to hide common layout elements
    document.body.classList.add("has-admin-page");
    
    getSession().then(async (session) => {
      if (!session) {
        router.push("/login");
      } else {
        const initialData = await getAllData();
        setData(initialData);
        setLoading(false);
      }
    });

    return () => {
      document.body.classList.remove("has-admin-page");
    };
  }, [router]);

  const handleSaveAbout = async (saveData: AboutData) => {
    const res = await updateAboutData(saveData);
    if (res.success) {
      setData(prev => prev ? { ...prev, about: saveData } : null);
      setMessage({ text: "Aboutデータを保存しました", type: "success" });
    } else {
      setMessage({ text: `保存に失敗しました: ${res.error || "Unknown error"}`, type: "error" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveWorks = async (saveData: WorkItem[]) => {
    const res = await updateWorksData(saveData);
    if (res.success) {
      setData(prev => prev ? { ...prev, works: saveData } : null);
      setMessage({ text: "Worksデータを保存しました", type: "success" });
    } else {
      setMessage({ text: `保存に失敗しました: ${res.error || "Unknown error"}`, type: "error" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading || !data) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500 font-semibold admin-body">
      Loading Admin Dashboard...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased admin-dashboard-root admin-body">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col z-50">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-lg font-bold text-xl">P</div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-800 m-0">Portfolio CMS</h2>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all ${
              activeTab === "about" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`} 
            onClick={() => setActiveTab("about")}
          >
            <span className="text-lg">👤</span>
            <span>プロフィール編集</span>
          </button>
          <button 
            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 font-semibold transition-all ${
              activeTab === "works" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`} 
            onClick={() => setActiveTab("works")}
          >
            <span className="text-lg">📁</span>
            <span>制作実績の管理</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout} 
            className="w-full px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span>🚪</span> ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 relative min-h-screen admin-main">
        {message && (
          <div className={`fixed top-8 right-8 ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"} text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3 font-bold animate-in fade-in slide-in-from-right-4 duration-300`}>
            <span>{message.type === "success" ? "✅" : "⚠️"}</span> {message.text}
          </div>
        )}
        
        <div className="p-12 w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
              {activeTab === "about" ? "Settings" : "Projects"}
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              {activeTab === "about" 
                ? "ポートフォリオに表示される基本情報、スキル、経歴を編集します。" 
                : "これまでのプロジェクトを追加・編集・削除します。"}
            </p>
          </div>

          <div className="w-full">
            {activeTab === "about" ? (
              <AboutEditor data={data.about} onSave={handleSaveAbout} />
            ) : (
              <WorksEditor data={data.works} aboutData={data.about} onSave={handleSaveWorks} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
