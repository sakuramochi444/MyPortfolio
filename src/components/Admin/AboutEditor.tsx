"use client";

import { AboutData, TimelineItem, SkillItem } from "@/types";
import { useState } from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";
import { uploadImage } from "@/lib/data-actions";

interface Props {
  data: AboutData;
  onSave: (data: AboutData) => void;
}

export default function AboutEditor({ data, onSave }: Props) {
  const [formData, setFormData] = useState<AboutData>(data);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: keyof AboutData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: keyof AboutData["contact"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleContactLinkChange = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...formData.contact.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, links: newLinks }
    }));
  };

  const addContactLink = () => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, links: [...prev.contact.links, { label: "", url: "" }] }
    }));
  };

  const removeContactLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, links: prev.contact.links.filter((_, i) => i !== index) }
    }));
  };

  const handleTimelineChange = (index: number, field: keyof TimelineItem, value: string) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    handleChange("timeline", newTimeline);
  };

  const addTimelineItem = () => {
    const newItem: TimelineItem = { date: "", title: "", jobTitle: "", description: "" };
    handleChange("timeline", [...formData.timeline, newItem]);
  };

  const removeTimelineItem = (index: number) => {
    handleChange("timeline", formData.timeline.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index: number, field: keyof SkillItem, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    handleChange("skills", newSkills);
  };

  const addSkillItem = () => {
    const newItem: SkillItem = { name: "" };
    handleChange("skills", [...formData.skills, newItem]);
  };

  const removeSkillItem = (index: number) => {
    handleChange("skills", formData.skills.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "profileIcon") => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const res = await uploadImage(reader.result as string, file.name);
        handleChange(field, res.path);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClass = "w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base font-medium";
  const labelClass = "block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider";

  return (
    <div className="space-y-12 pb-32">
      {/* Basic Profile */}
      <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>📝</span> 基本プロフィール
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-4">
            <label className={labelClass}>プロフィール画像</label>
            <div className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center">
              {formData.profileIcon ? (
                <img src={formData.profileIcon} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 text-4xl">{isUploading ? "⏳" : "👤"}</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-white px-4 py-2 rounded-lg font-bold text-sm">
                  {isUploading ? "アップロード中..." : "画像をアップロード"}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "profileIcon")} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col items-start">
              <label className={labelClass}>フルネーム</label>
              <input 
                type="text" 
                className={`${inputClass} text-2xl font-bold py-6`} 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
              />
            </div>
            <div className="flex flex-col items-start">
              <label className={labelClass}>自己紹介文</label>
              <AutoResizeTextarea
                className={inputClass}
                value={formData.introduction}
                onChange={(e) => handleChange("introduction", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🏆</span> 資格・受賞歴
        </h3>
        <div className="space-y-4">
          <AutoResizeTextarea
            className={inputClass}
            placeholder="項目をカンマ区切りで入力（例: 基本情報技術者, TOEIC 800点）"
            value={formData.qualifications?.join(", ") || ""}
            onChange={(e) => handleChange("qualifications", e.target.value.split(",").map(s => s.trim()))}
          />
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>📧</span> 連絡先
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-start">
            <label className={labelClass}>メールアドレス</label>
            <input type="text" className={inputClass} value={formData.contact.email} onChange={(e) => handleContactChange("email", e.target.value)} />
          </div>
          <div className="flex flex-col items-start">
            <label className={labelClass}>学校用メール</label>
            <input type="text" className={inputClass} value={formData.contact.schoolEmail} onChange={(e) => handleContactChange("schoolEmail", e.target.value)} />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className={labelClass}>SNS / 外部リンク</label>
            <button 
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200" 
              onClick={addContactLink}
            >
              + リンク追加
            </button>
          </div>
          {formData.contact.links.map((link, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <input 
                  type="text" 
                  className={inputClass} 
                  placeholder="ラベル (例: GitHub)" 
                  value={link.label} 
                  onChange={(e) => handleContactLinkChange(index, "label", e.target.value)} 
                />
              </div>
              <div className="flex-[2] space-y-1">
                <input 
                  type="text" 
                  className={inputClass} 
                  placeholder="URL (https://...)" 
                  value={link.url} 
                  onChange={(e) => handleContactLinkChange(index, "url", e.target.value)} 
                />
              </div>
              <button 
                className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all" 
                onClick={() => removeContactLink(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📅</span> 経歴
          </h3>
          <button 
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700 transition-all" 
            onClick={addTimelineItem}
          >
            + 項目を追加
          </button>
        </div>
        
        <div className="space-y-8">
          {formData.timeline.map((item, index) => (
            <div key={index} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative group">
              <div className="grid grid-cols-12 gap-6 mb-6">
                <div className="col-span-3 flex flex-col items-start">
                  <label className={labelClass}>日付</label>
                  <input type="text" className={inputClass} value={item.date} onChange={(e) => handleTimelineChange(index, "date", e.target.value)} />
                </div>
                <div className="col-span-9 flex flex-col items-start">
                  <label className={labelClass}>タイトル</label>
                  <input type="text" className={inputClass} value={item.title} onChange={(e) => handleTimelineChange(index, "title", e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col items-start mb-6">
                <label className={labelClass}>サブタイトル</label>
                <input type="text" className={inputClass} value={item.jobTitle} onChange={(e) => handleTimelineChange(index, "jobTitle", e.target.value)} />
              </div>
              <div className="flex flex-col items-start">
                <label className={labelClass}>詳細説明</label>
                <AutoResizeTextarea
                  className={inputClass}
                  value={item.description}
                  onChange={(e) => handleTimelineChange(index, "description", e.target.value)}
                />
              </div>
              <button 
                className="mt-6 text-red-500 font-bold text-sm hover:underline" 
                onClick={() => removeTimelineItem(index)}
              >
                この経歴を削除
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>⚡</span> スキル定義
          </h3>
          <button 
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700 transition-all" 
            onClick={addSkillItem}
          >
            + 追加
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formData.skills.map((skill, index) => (
            <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
              <div className="flex flex-col items-start mb-4">
                <label className={labelClass}>スキル名</label>
                <input type="text" className={inputClass} value={skill.name} onChange={(e) => handleSkillChange(index, "name", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-start">
                  <label className={labelClass}>Devicon ID</label>
                  <input type="text" className={inputClass} value={skill.deviconName || ""} onChange={(e) => handleSkillChange(index, "deviconName", e.target.value)} />
                </div>
                <div className="flex flex-col items-start">
                  <label className={labelClass}>SI Name</label>
                  <input type="text" className={inputClass} value={skill.siName || ""} onChange={(e) => handleSkillChange(index, "siName", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col items-start">
                  <label className={labelClass}>Icon Class</label>
                  <input type="text" className={inputClass} value={skill.iconClass || ""} onChange={(e) => handleSkillChange(index, "iconClass", e.target.value)} />
                </div>
                <div className="flex flex-col items-start">
                  <label className={labelClass}>Color (HEX)</label>
                  <input type="text" className={inputClass} value={skill.color || ""} onChange={(e) => handleSkillChange(index, "color", e.target.value)} />
                </div>
              </div>
              <button 
                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg" 
                onClick={() => removeSkillItem(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Save Button */}
      <div className="fixed bottom-12 right-12 z-[100]">
        <button 
          className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-xl shadow-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4" 
          onClick={() => onSave(formData)}
        >
          <span>💾</span> 変更を保存して公開
        </button>
      </div>
    </div>
  );
}
