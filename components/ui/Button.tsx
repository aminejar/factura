import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  loading?: boolean;
}

export function Button({ children, loading = false, asChild = false, ...props }: ButtonProps) {
  if (asChild) {
    return (
      <div
        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        {...(props as any)}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
        )}
        {children}
      </div>
    );
  }

  return (
    <button
      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
      )}
      {children}
    </button>
  );
}
