import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StockBadge from "@/components/molecules/StockBadge";
import QuickActionButton from "@/components/molecules/QuickActionButton";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ProductTable = ({ products, onEdit, onDelete, onStockAdjust }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-slate-400" />;
    }
    return sortDirection === "asc" 
      ? <ApperIcon name="ArrowUp" className="w-4 h-4 text-primary-600" />
      : <ApperIcon name="ArrowDown" className="w-4 h-4 text-primary-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-card border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Product Name
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left py-4 px-6">
                <button
                  onClick={() => handleSort("sku")}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  SKU
                  <SortIcon field="sku" />
                </button>
              </th>
              <th className="text-left py-4 px-6">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Price
                  <SortIcon field="price" />
                </button>
              </th>
              <th className="text-left py-4 px-6">
                <button
                  onClick={() => handleSort("currentStock")}
                  className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Stock Level
                  <SortIcon field="currentStock" />
                </button>
              </th>
              <th className="text-right py-4 px-6 font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <AnimatePresence>
              {sortedProducts.map((product, index) => (
                <motion.tr
                  key={product.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-25 transition-all duration-200"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Updated {new Date(product.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="default">{product.sku}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(product.price)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <StockBadge 
                      currentStock={product.currentStock}
                      lowStockThreshold={product.lowStockThreshold}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <QuickActionButton 
                        product={product}
                        onStockAdjust={onStockAdjust}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8 p-0 hover:bg-primary-50 hover:text-primary-600"
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.Id)}
                        className="h-8 w-8 p-0 hover:bg-error-50 hover:text-error-600"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;