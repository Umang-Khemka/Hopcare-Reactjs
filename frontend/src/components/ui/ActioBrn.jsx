import { useNavigate } from "react-router-dom";

export default function ActionBtn({ icon, label,to }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={()=> to && navigate(to)}
      className="w-full flex items-center gap-3 px-5 py-3 rounded-xl
                 bg-gradient-to-r from-blue-600 to-blue-700
                 text-white font-medium shadow
                 hover:from-blue-700 hover:to-blue-800 transition"
    >
      {icon}
      {label}
    </button>
  );
}
