import React from 'react';
import { useSelector } from 'react-redux';
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineChevronDown,
  HiOutlineCog,
  HiOutlineMail
} from 'react-icons/hi';

const HrHeader = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);

  const userName = localStorage.getItem('hrName') || localStorage.getItem('userName') || user?.name || 'HR User';

  return (
    <header className="bg-[#e9f2ff]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-white/60"
            >
              <HiOutlineMenu className="w-6 h-6 text-slate-700" />
            </button>

            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-700 text-white text-sm font-semibold"
            >
              All Candidates
              <HiOutlineChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 px-4">
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/60 bg-white/70 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-full bg-indigo-800 text-white flex items-center justify-center">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full bg-red-600 text-white flex items-center justify-center">
                13
              </span>
            </button>

            <button className="relative w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
              <HiOutlineCog className="w-5 h-5" />
            </button>

            <button className="relative w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
              <HiOutlineMail className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full bg-red-600 text-white flex items-center justify-center">
                13
              </span>
            </button>

            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
              {String(userName).charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HrHeader;
