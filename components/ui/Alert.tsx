import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AlertProps {
  type: "error" | "success";
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  const isError = type === "error";
  
  return (
    <div className={`mb-6 p-4 ${isError ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'} border rounded-xl flex items-start gap-3`}>
      {isError ? (
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
      )}
      <div>
        <p className={`text-sm font-semibold ${isError ? 'text-red-900' : 'text-emerald-900'}`}>
          {isError ? 'Error' : 'Success'}
        </p>
        <p className={`text-sm ${isError ? 'text-red-700' : 'text-emerald-700'}`}>{message}</p>
      </div>
    </div>
  );
}