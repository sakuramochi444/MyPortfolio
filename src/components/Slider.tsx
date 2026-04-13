"use client";

import Image from "next/image";

interface SliderProps {
  images: string[];
}

export default function Slider({ images }: SliderProps) {
  // Original HTML repeats the images to make it loop smoothly
  const repeatedImages = [...images, ...images];

  return (
    <div className="slider-container">
      <div className="slider-track" style={{ animationDuration: `${images.length * 5}s` }}>
        {repeatedImages.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Project Image ${index}`}
            width={300}
            height={200}
          />
        ))}
      </div>
    </div>
  );
}
