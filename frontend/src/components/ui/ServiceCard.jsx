import React from "react";

export default function ServiceCard({
  title,
  description,
  icon,
  variant = "blue",
}) {
  const variants = {
    blue: "bg-gradient-to-b from-[#6EC1F2] to-[#0B5FA5]",
    red: "bg-[#FF5A5F]",
  };

  return (
    <div
      className={`
        ${variants[variant]}
        text-white rounded-3xl p-8
        w-[300px] h-[300px]
        flex flex-col justify-between
        shadow-xl
        transition-transform hover:scale-105
      `}
    >
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-sm leading-relaxed opacity-90">
          {description}
        </p>
      </div>
    </div>
  );
}
