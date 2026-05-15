import { type InputHTMLAttributes, useState, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: ReactNode;
  isPassword?: boolean;
};

export default function Input({ label, error, icon, isPassword, className = '', ...props }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        <input
          {...props}
          type={isPassword ? (show ? 'text' : 'password') : props.type}
          className={[
            'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all',
            icon ? 'pl-10' : '',
            isPassword ? 'pr-10' : '',
            error ? 'border-red-400 bg-red-50' : 'border-gray-200',
            className,
          ].join(' ')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
