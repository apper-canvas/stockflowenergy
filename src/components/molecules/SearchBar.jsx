import React from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" className="h-4 w-4 text-slate-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10"
        {...props}
      />
    </div>
  );
};

export default SearchBar;