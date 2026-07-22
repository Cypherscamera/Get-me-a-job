import React from 'react';

interface HeaderProps {
  currentUser?: string | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="w-full bg-[#1d1d1f] text-[#f5f5f7] py-6 px-8 border-b border-[#333333] sticky top-0 z-30 font-sans">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Get Me A Job</h1>
          <p className="text-sm font-light text-[#858585] mt-1">
            AI-powered job pipeline built using Scrapling + Agent Reach
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-4 bg-[#333333]/40 border border-[#474747]/40 px-4 py-2.5 rounded-xl self-start md:self-auto">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#858585] font-semibold uppercase tracking-wider leading-none">
                Logged in as
              </span>
              <span className="text-sm font-semibold text-white capitalize">
                {currentUser}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 bg-transparent px-3.5 py-1.5 rounded-full border border-rose-400/30 hover:border-rose-400/50 hover:bg-rose-400/10 transition-all duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
