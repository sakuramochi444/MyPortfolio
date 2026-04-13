"use client";

import { useEffect, useRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export default function AutoResizeTextarea({ value, className = "", ...props }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        if (props.onChange) props.onChange(e);
        resize();
      }}
      className={`w-full p-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none overflow-hidden min-h-[120px] leading-relaxed text-base ${className}`}
    />
  );
}
