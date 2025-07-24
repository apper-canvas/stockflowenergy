import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const ProductModal = ({ isOpen, onClose, onSave, product = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    currentStock: "",
    lowStockThreshold: "10"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        price: product.price?.toString() || "",
        currentStock: product.currentStock?.toString() || "",
        lowStockThreshold: product.lowStockThreshold?.toString() || "10"
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        price: "",
        currentStock: "",
        lowStockThreshold: "10"
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
      newErrors.currentStock = "Valid stock quantity is required";
    }

    if (!formData.lowStockThreshold || parseInt(formData.lowStockThreshold) < 0) {
      newErrors.lowStockThreshold = "Valid threshold is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      currentStock: parseInt(formData.currentStock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      lastUpdated: new Date().toISOString()
    };

    if (product) {
      productData.Id = product.Id;
    }

    onSave(productData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Product Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="Enter product name"
            />

            <FormField
              label="SKU"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              error={errors.sku}
              required
              placeholder="Enter SKU"
            />

            <FormField
              label="Price"
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              required
              placeholder="0.00"
            />

            <FormField
              label="Current Stock"
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              value={formData.currentStock}
              onChange={handleChange}
              error={errors.currentStock}
              required
              placeholder="Enter current stock quantity"
            />

            <FormField
              label="Low Stock Threshold"
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min="0"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              error={errors.lowStockThreshold}
              required
              placeholder="Enter threshold for low stock alerts"
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    {product ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {product ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;