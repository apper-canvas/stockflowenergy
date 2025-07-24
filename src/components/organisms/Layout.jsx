import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = ({ children, title, searchValue, onSearchChange, showSearch = false, onAddClick, addButtonLabel, headerProps = {} }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={title}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          showSearch={showSearch}
          onAddClick={onAddClick}
          addButtonLabel={addButtonLabel}
          onMobileMenuClick={handleMobileMenuClick}
          {...headerProps}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;