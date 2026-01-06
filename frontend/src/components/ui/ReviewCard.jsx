import { Star } from "lucide-react";

export default function ReviewCard({ name, time, review }) {
  return (
    <div className="bg-white text-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <img
          src="./google-logo.webp"
          alt="Google"
          className="w-5 h-5"
        />
      </div>

      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
        {review}
      </p>

      <button className="text-sm text-blue-600 mt-2 font-medium">
        Read more
      </button>
    </div>
  );
}
