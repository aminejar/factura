import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: LucideIcon;
  showToggle?: boolean;
  togglePassword?: boolean;
  onToggle?: () => void;
}

export default function InputField({
  label, type, value, onChange, placeholder, icon: Icon,
  showToggle, togglePassword, onToggle
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400"
        />
        {showToggle && (
          <button
            onClick={onToggle}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {togglePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
}
