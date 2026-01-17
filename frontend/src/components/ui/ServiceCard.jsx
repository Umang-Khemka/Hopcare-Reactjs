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
        text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8
        w-full sm:w-auto
        min-h-[280px] sm:h-[300px]
        flex flex-col justify-between
        shadow-xl
        transition-transform hover:scale-105
      `}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{title}</h3>
        <p className="text-xs sm:text-sm leading-relaxed opacity-90">
          {description}
        </p>
      </div>
    </div>
  );
}