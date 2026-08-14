import React from 'react';
import { ViewMode } from '../types';
import { 
  LayoutDashboard, 
  FolderGit2, 
  BookOpen, 
  Wand2, 
  Edit3, 
  BookMarked, 
  Users, 
  Globe2, 
  Clock, 
  GitBranch, 
  FileText, 
  ScanSearch,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse
}) => {
  const menuItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Quản Lý Dự Án', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'stories', label: 'Quản Lý Truyện', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'wizard', label: 'Story Wizard (11 B)', icon: <Wand2 className="w-4 h-4" />, badge: 'AI' },
    { id: 'editor', label: 'Studio Viết Truyện', icon: <Edit3 className="w-4 h-4" /> },
    { id: 'bible', label: 'Thánh Kinh Story Bible', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'characters', label: 'Nhân Vật & Sơ Đồ', icon: <Users className="w-4 h-4" /> },
    { id: 'world', label: 'Thiết Lập Thế Giới', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'timeline', label: 'Dòng Thời Gian', icon: <Clock className="w-4 h-4" /> },
    { id: 'plot', label: 'Kịch Bản Tổng Thể', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'style_learning', label: 'Học Văn Phong File', icon: <FileText className="w-4 h-4" />, badge: 'Upload' },
    { id: 'logic_scanner', label: 'Quét Logic & Fix', icon: <ScanSearch className="w-4 h-4" />, badge: 'Scan' }
  ];

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="py-3 px-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 truncate">
                <div className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</div>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!collapsed && item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-950 text-indigo-400 border border-indigo-800/50'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-800/80 flex items-center justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors w-full flex items-center justify-center"
          title={collapsed ? 'Mở rộng Sidebar' : 'Thu nhỏ Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
