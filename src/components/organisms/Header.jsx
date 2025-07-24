import React, { useState, useContext } from "react";
import { useSelector } from 'react-redux';
import { AuthContext } from '@/App';
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  showSearch = false,
  onAddClick,
  addButtonLabel = "Add Product",
  onMobileMenuClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-slate-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuClick}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="hidden sm:block">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search products..."
                className="w-80"
              />
            </div>
          )}
          
          {onAddClick && (
            <Button onClick={onAddClick} className="flex items-center gap-2">
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">{addButtonLabel}</span>
            </Button>
          )}
        </div>
      </div>
      
      {showSearch && (
        <div className="mt-4 sm:hidden">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search products..."
          />
        </div>
      )}
    </motion.div>
  );
};

export default Header;