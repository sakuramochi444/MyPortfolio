"use client";

import { WorkItem, AboutData, SkillItem } from "@/types";
import { useState } from "react";
import AutoResizeTextarea from "./AutoResizeTextarea";
import { uploadImage } from "@/lib/data-actions";

interface Props {
  data: WorkItem[];
  aboutData: AboutData;
  onSave: (data: WorkItem[]) => void;
}

export default function WorksEditor({ data, aboutData, onSave }: Props) {
  const [works, setWorks] = useState<WorkItem[]>(data);
  const [isUploading, setIsUploading] = useState<string | null>(null); // workId-field-index

  const handleWorkChange = (index: number, field: keyof WorkItem, value: any) => {
    const newWorks = [...works];
    newWorks[index] = { ...newWorks[index], [field]: value };
    setWorks(newWorks);
  };

  const handleLinkChange = (workIndex: number, linkIndex: number, field: "label" | "url", value: string) => {
    const newLinks = [...(works[workIndex].links || [])];
    newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
    handleWorkChange(workIndex, "links", newLinks);
  };

  const addLink = (workIndex: number) => {
    const newLinks = [...(works[workIndex].links || []), { label: "", url: "" }];
    handleWorkChange(workIndex, "links", newLinks);
  };

  const removeLink = (workIndex: number, linkIndex: number) => {
    const newLinks = works[workIndex].links.filter((_, i) => i !== linkIndex);
    handleWorkChange(workIndex, "links", newLinks);
  };

  const toggleSkill = (workIndex: number, skill: SkillItem) => {
    const currentSkills = works[workIndex].skills || [];
    const exists = currentSkills.find(s => s.name === skill.name);
    
    let newSkills;
    if (exists) {
      newSkills = currentSkills.filter(s => s.name !== skill.name);
    } else {
      newSkills = [...currentSkills, skill];
    }
    handleWorkChange(workIndex, "skills", newSkills);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, workIndex: number, field: "thumbnail" | "images", galleryIndex?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadId = `${works[workIndex].id}-${field}-${galleryIndex ?? "main"}`;
      setIsUploading(uploadId);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const res = await uploadImage(reader.result as string, file.name);
        const result = res.path;
        
        if (field === "thumbnail") {
          handleWorkChange(workIndex, "thumbnail", result);
        } else if (field === "images" && galleryIndex !== undefined) {
          const newImages = [...works[workIndex].images];
          newImages[galleryIndex] = result;
          handleWorkChange(workIndex, "images", newImages);
        } else if (field === "images") {
          handleWorkChange(workIndex, "images", [...works[workIndex].images, result]);
        }
        setIsUploading(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const addWork = () => {
    const newWork: WorkItem = {
      id: `work-${Date.now()}`,
      title: "新規プロジェクト",
      description: "",
      thumbnail: "",
      skills: [],
      overview: "",
      role: "",
      links: [],
      images: [],
    };
    setWorks([...works, newWork]);
  };

  const removeWork = (index: number) => {
    if (confirm("この制作実績を削除してもよろしいですか？")) {
      setWorks(works.filter((_, i) => i !== index));
    }
  };

  const inputClass = "w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-base font-medium";
  const labelClass = "block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider";

  return (
    <div className="space-y-12 pb-32">
      <div className="flex justify-end">
        <button 
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-700 transition-all shadow-xl flex items-center gap-3" 
          onClick={addWork}
        >
          <span>➕</span> 新規プロジェクトを追加
        </button>
      </div>

      <div className="space-y-16">
        {works.map((work, index) => (
          <div key={work.id} className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm relative space-y-10 group">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md font-mono text-xs font-bold tracking-widest">{work.id}</span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{work.title || "無題のプロジェクト"}</h3>
              </div>
              <button 
                className="px-5 py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm" 
                onClick={() => removeWork(index)}
              >
                プロジェクトを削除
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex flex-col items-start">
                  <label className={labelClass}>プロジェクト名</label>
                  <input type="text" className={`${inputClass} text-xl font-bold`} value={work.title} onChange={(e) => handleWorkChange(index, "title", e.target.value)} />
                </div>
                <div className="flex flex-col items-start">
                  <label className={labelClass}>URL ID (半角英数ハイフン推奨)</label>
                  <input type="text" className={inputClass} value={work.id} onChange={(e) => handleWorkChange(index, "id", e.target.value)} />
                </div>
                <div className="flex flex-col items-start">
                  <label className={labelClass}>短い説明文</label>
                  <AutoResizeTextarea className={inputClass} value={work.description} onChange={(e) => handleWorkChange(index, "description", e.target.value)} />
                </div>
                
                {/* Project Links */}
                <div className="flex flex-col items-start w-full space-y-4">
                  <div className="flex justify-between items-center w-full">
                    <label className={labelClass}>プロジェクトリンク (GitHub, Demo等)</label>
                    <button 
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200" 
                      onClick={() => addLink(index)}
                    >
                      + リンク追加
                    </button>
                  </div>
                  <div className="space-y-3 w-full">
                    {work.links?.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            className={`${inputClass} !p-2 text-sm`} 
                            placeholder="ラベル (例: GitHub)" 
                            value={link.label} 
                            onChange={(e) => handleLinkChange(index, linkIndex, "label", e.target.value)} 
                          />
                        </div>
                        <div className="flex-[2]">
                          <input 
                            type="text" 
                            className={`${inputClass} !p-2 text-sm`} 
                            placeholder="URL" 
                            value={link.url} 
                            onChange={(e) => handleLinkChange(index, linkIndex, "url", e.target.value)} 
                          />
                        </div>
                        <button 
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" 
                          onClick={() => removeLink(index, linkIndex)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col items-start">
                  <label className={labelClass}>サムネイル画像</label>
                  <div className="w-32 h-32 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 relative group/thumb">
                    {work.thumbnail ? (
                      <img src={work.thumbnail} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        {isUploading === `${work.id}-thumbnail-main` ? "⏳" : "🖼️"}
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <span className="text-white text-xs font-bold">{isUploading === `${work.id}-thumbnail-main` ? "..." : "変更"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index, "thumbnail")} disabled={!!isUploading} />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <label className={labelClass}>主な担当 / 役割</label>
                  <input type="text" className={inputClass} value={work.role} onChange={(e) => handleWorkChange(index, "role", e.target.value)} />
                </div>
                
                {/* Skills Selection */}
                <div className="flex flex-col items-start w-full">
                  <label className={labelClass}>使用技術 (Aboutのスキルから選択)</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100 w-full">
                    {aboutData.skills.map((skill) => {
                      const isSelected = work.skills?.some(s => s.name === skill.name);
                      return (
                        <button
                          key={skill.name}
                          type="button"
                          onClick={() => toggleSkill(index, skill)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isSelected 
                              ? "bg-blue-600 border-blue-600 text-white" 
                              : "bg-white border-slate-200 text-slate-500 hover:border-blue-400"
                          }`}
                        >
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start pt-6">
              <label className={labelClass}>詳細なプロジェクト概要</label>
              <AutoResizeTextarea className={inputClass} value={work.overview} onChange={(e) => handleWorkChange(index, "overview", e.target.value)} />
            </div>

            {/* Gallery Images */}
            <div className="flex flex-col items-start pt-6 space-y-4">
              <label className={labelClass}>追加ギャラリー画像</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
                {work.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200 group/img">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <button 
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      onClick={() => {
                        const newImgs = work.images.filter((_, i) => i !== imgIndex);
                        handleWorkChange(index, "images", newImgs);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="aspect-video rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all text-slate-400">
                  <span className="text-2xl">{isUploading?.includes(`${work.id}-images`) ? "⏳" : "+"}</span>
                  <span className="text-[10px] font-bold">画像追加</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index, "images")} disabled={!!isUploading} />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-12 right-12 z-[100]">
        <button 
          className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-xl shadow-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4" 
          onClick={() => onSave(works)}
        >
          <span>💾</span> 全制作実績を保存
        </button>
      </div>
    </div>
  );
}
