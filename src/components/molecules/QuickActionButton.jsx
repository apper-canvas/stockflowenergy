import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";

const QuickActionButton = ({ product, onStockAdjust }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adjustment, setAdjustment] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const adjustmentValue = parseInt(adjustment);
    if (adjustmentValue && adjustmentValue > 0) {
      onStockAdjust(product.Id, adjustmentType, adjustmentValue);
      setAdjustment("");
      setIsOpen(false);
    }
  };

  const handleQuickAdjust = (type, amount) => {
    onStockAdjust(product.Id, type, amount);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <ApperIcon name="Edit3" className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-10 z-50 w-72 bg-white rounded-lg shadow-lg border border-slate-200 p-4"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-1">{product.name}</h4>
                <p className="text-sm text-slate-500">Current Stock: {product.currentStock}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust("add", 1)}
                  className="text-success-600 border-success-300 hover:bg-success-50"
                >
                  <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                  +1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust("subtract", 1)}
                  className="text-error-600 border-error-300 hover:bg-error-50"
                  disabled={product.currentStock === 0}
                >
                  <ApperIcon name="Minus" className="h-4 w-4 mr-1" />
                  -1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust("add", 5)}
                  className="text-success-600 border-success-300 hover:bg-success-50"
                >
                  <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                  +5
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdjust("subtract", 5)}
                  className="text-error-600 border-error-300 hover:bg-error-50"
                  disabled={product.currentStock < 5}
                >
                  <ApperIcon name="Minus" className="h-4 w-4 mr-1" />
                  -5
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="add">Add Stock</option>
                    <option value="subtract">Subtract Stock</option>
                  </select>
                  <Input
                    ref={inputRef}
                    type="number"
                    placeholder="Amount"
                    value={adjustment}
                    onChange={(e) => setAdjustment(e.target.value)}
                    min="1"
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1">
                    Apply
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActionButton;