/// <reference types="@cloudflare/workers-types" />

export interface TimelineItem {
  date: string;
  title: string;
  jobTitle: string;
  description: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  iconClass?: string; // fa-brands fa-unity etc.
  deviconName?: string; // devicon-csharp-plain etc.
  siName?: string; // si si-nextdotjs
  color?: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface AboutData {
  name: string;
  profileIcon: string;
  introduction: string;
  timeline: TimelineItem[];
  qualifications: string[];
  skills: SkillItem[];
  contact: {
    email: string;
    schoolEmail: string;
    links: LinkItem[];
  };
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  skills: SkillItem[];
  overview: string;
  role: string;
  links: LinkItem[];
  images: string[];
}
