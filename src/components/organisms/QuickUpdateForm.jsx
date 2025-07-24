import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import StockBadge from "@/components/molecules/StockBadge";
import { formatCurrency } from "@/utils/formatters";

const QuickUpdateForm = ({ products, onStockAdjust }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const currentProduct = products.find(p => p.Id.toString() === selectedProduct);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      return;
    }

    onStockAdjust(parseInt(selectedProduct), adjustmentType, parseInt(quantity), notes);
    
    // Reset form
    setQuantity("");
    setNotes("");
  };

  const handleQuickAdjust = (type, amount) => {
    if (!selectedProduct) return;
    onStockAdjust(parseInt(selectedProduct), type, amount, `Quick ${type} of ${amount} units`);
  };

  return (
    <div className="bg-white rounded-lg shadow-card border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Quick Stock Update</h2>
        <p className="text-slate-600">Make rapid adjustments to your inventory levels</p>
      </div>

      <div className="space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Choose a product...</option>
            {products.map((product) => (
              <option key={product.Id} value={product.Id.toString()}>
                {product.name} - {product.sku}
              </option>
            ))}
          </select>
        </div>

        {/* Product Details */}
        {currentProduct && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900">{currentProduct.name}</h3>
              <StockBadge 
                currentStock={currentProduct.currentStock}
                lowStockThreshold={currentProduct.lowStockThreshold}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Current Stock:</span>
                <span className="ml-2 font-semibold text-slate-900">
                  {currentProduct.currentStock} units
                </span>
              </div>
              <div>
                <span className="text-slate-600">Price:</span>
                <span className="ml-2 font-semibold text-slate-900">
                  {formatCurrency(currentProduct.price)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {currentProduct && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Quick Actions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickAdjust("add", 1)}
                className="text-success-600 border-success-300 hover:bg-success-50"
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add 1
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickAdjust("subtract", 1)}
                className="text-error-600 border-error-300 hover:bg-error-50"
                disabled={currentProduct.currentStock === 0}
              >
                <ApperIcon name="Minus" className="h-4 w-4 mr-2" />
                Remove 1
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickAdjust("add", 5)}
                className="text-success-600 border-success-300 hover:bg-success-50"
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add 5
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickAdjust("subtract", 5)}
                className="text-error-600 border-error-300 hover:bg-error-50"
                disabled={currentProduct.currentStock < 5}
              >
                <ApperIcon name="Minus" className="h-4 w-4 mr-2" />
                Remove 5
              </Button>
            </div>
          </div>
        )}

        {/* Manual Adjustment Form */}
        {currentProduct && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Action Type
                </label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="add">Add Stock</option>
                  <option value="subtract">Remove Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this adjustment..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedProduct || !quantity || parseInt(quantity) <= 0}
            >
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              Apply Adjustment
            </Button>
          </form>
        )}

        {!currentProduct && (
          <div className="text-center py-8 text-slate-500">
            Select a product to begin making stock adjustments
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickUpdateForm;