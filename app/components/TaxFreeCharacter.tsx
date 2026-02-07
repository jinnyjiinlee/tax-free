"use client";

import Image from "next/image";

interface TaxFreeCharacterProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export default function TaxFreeCharacter({
  size = "md",
  className = "",
  animate = true,
}: TaxFreeCharacterProps) {
  const sizeMap = {
    sm: { container: "w-16 h-16", px: 64 },
    md: { container: "w-40 h-40", px: 160 },
    lg: { container: "w-64 h-64", px: 256 },
  };

  const { container, px } = sizeMap[size];

  return (
    <div
      className={`inline-block ${container} ${
        animate ? "animate-float" : ""
      } ${className}`}
    >
      <Image
        src="/character.png"
        alt="텍스프리 캐릭터"
        width={px}
        height={px}
        className="w-full h-full object-contain drop-shadow-lg"
        priority
      />
    </div>
  );
}
