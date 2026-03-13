import Link from 'next/link';
import { FileText, LayoutDashboard, FileStack, BarChart2, Settings, ChevronUp } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">ResumePulse</span>
      </div>
      
      <div className="px-4 mb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">AI Resume Analyzer</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-medium transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
          <FileStack className="w-5 h-5" />
          My Resumes
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
          <BarChart2 className="w-5 h-5" />
          Insights
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              JD
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Pro Plan</p>
            </div>
          </div>
          <ChevronUp className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </aside>
  );
}
