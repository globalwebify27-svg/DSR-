import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF5722] flex items-center justify-center mb-4 border border-orange-100 shadow-xs">
        <FileQuestion className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-1">
        404 — Page Not Found
      </span>

      <h1 className="text-xl sm:text-2xl font-black text-[#171923] mb-2 tracking-tight">
        Lost in the Field?
      </h1>

      <p className="text-xs text-[#737784] max-w-sm mb-6">
        The report or page you are looking for doesn&apos;t exist or may have been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-md transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
