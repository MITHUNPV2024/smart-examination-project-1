import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Calendar, ClipboardCheck, GraduationCap, 
  LayoutDashboard, LogOut, Menu, User, Bell, X, FileText, ShieldAlert, BarChart3, Database, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light', saved === 'light');
    }
    return saved;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light', theme === 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const getNavigationLinks = () => {
    const role = user?.role;
    
    const base = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    if (role === 'SUPER_ADMIN' || role === 'COLLEGE_ADMIN') {
      return [
        ...base,
        { name: 'Academic Records', path: '/admin/academics', icon: Database },
        { name: 'Exam Schedules', path: '/admin/exams', icon: Calendar },
        { name: 'Room Allocations', path: '/admin/rooms', icon: ClipboardCheck },
        { name: 'Reports & Audit Logs', path: '/admin/reports', icon: ShieldAlert },
      ];
    }

    if (role === 'DEPARTMENT_HOD' || role === 'FACULTY') {
      return [
        ...base,
        { name: 'Question Bank', path: '/faculty/questions', icon: BookOpen },
        { name: 'Digital Evaluation', path: '/faculty/evaluation', icon: FileText },
        { name: 'Analytics', path: '/faculty/analytics', icon: BarChart3 },
      ];
    }

    if (role === 'INTERNAL_EXAMINER' || role === 'EXTERNAL_EXAMINER') {
      return [
        ...base,
        { name: 'Digital Evaluation', path: '/examiner/evaluation', icon: FileText },
      ];
    }

    if (role === 'STUDENT') {
      return [
        ...base,
        { name: 'My Exams', path: '/student/exams', icon: Calendar },
        { name: 'My Results', path: '/student/results', icon: GraduationCap },
      ];
    }

    if (role === 'PARENT') {
      return [
        ...base,
        { name: 'Ward Performance', path: '/parent/ward', icon: GraduationCap },
      ];
    }

    return base;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = getNavigationLinks();

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 border-r transition-all duration-300 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className={`h-16 flex items-center justify-between px-6 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
          <Link to="/dashboard" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-indigo-500" />
            {isSidebarOpen && (
              <span className="font-semibold text-lg bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent font-display">
                SmartExam
              </span>
            )}
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : theme === 'light'
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-6 border-b transition-colors duration-300 ${theme === 'light' ? 'bg-white/90 border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'} backdrop-blur-md`}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`${theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-100'} focus:outline-none`}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full transition-colors relative ${theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500"></span>
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl p-4 z-50 border ${theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'}`}
                  >
                    <div className={`flex items-center justify-between mb-3 pb-2 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
                      <span className="font-semibold text-sm">Notifications</span>
                      <button 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className={`p-2.5 rounded-lg transition-colors cursor-pointer ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-800/50 hover:bg-slate-800'}`}>
                        <p className="text-xs font-semibold text-indigo-500">Exam Scheduling</p>
                        <p className="text-xs mt-1">Semester 1 Exam Schedule has been published.</p>
                      </div>
                      <div className={`p-2.5 rounded-lg transition-colors cursor-pointer ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-800/50 hover:bg-slate-800'}`}>
                        <p className="text-xs font-semibold text-emerald-500">Result Publication</p>
                        <p className="text-xs mt-1">Revaluation results for CSE-101 are now live.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className={`p-2 rounded-full transition-all flex items-center justify-center border shadow-xs ${
                theme === 'dark'
                  ? 'text-amber-400 bg-slate-900 border-slate-800 hover:bg-slate-800'
                  : 'text-indigo-600 bg-slate-100 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Dropdown */}
            <div className={`flex items-center space-x-3 pl-2 border-l ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-indigo-500 font-semibold">{user?.role ? user.role.replace(/_/g, ' ') : ''}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Viewport content */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 transition-colors duration-300 ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-950'}`}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
