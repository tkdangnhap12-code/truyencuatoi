import React from 'react';
import { AlertTriangle, RefreshCw, Copy, Check, ShieldAlert } from 'lucide-react';

interface ErrorScreenProps {
  error: Error | null;
  errorInfo?: string;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, errorInfo, onRetry }) => {
  const [copied, setCopied] = React.useState(false);

  const errorMessage = error?.message || 'Lỗi hệ thống không xác định';
  const errorDetails = error?.stack || errorInfo || 'Không có thêm thông tin chi tiết.';

  const handleCopy = () => {
    const textToCopy = `[AI NOVEL STUDIO ERROR]\nError: ${errorMessage}\n\nDetails:\n${errorDetails}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-4 text-red-400 border-b border-slate-800 pb-4">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI NOVEL STUDIO KHÔNG THỂ KHỞI ĐỘNG
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ứng dụng gặp sự cố ngoài dự kiến trong quá trình xử lý. Dữ liệu của bạn trong IndexedDB vẫn được an toàn.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>CHI TIẾT LỖI</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Đã sao chép' : 'Sao chép lỗi'}
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-red-300 overflow-x-auto max-h-48 whitespace-pre-wrap select-text">
            {errorMessage}
            {'\n\n'}
            {errorDetails}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
          <button
            onClick={handleReload}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            Tải lại ứng dụng
          </button>
        </div>
      </div>
    </div>
  );
};
