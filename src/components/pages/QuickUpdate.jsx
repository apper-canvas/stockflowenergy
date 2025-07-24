import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QuickUpdateForm from "@/components/organisms/QuickUpdateForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const QuickUpdate = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockAdjust = async (productId, type, quantity, notes = "") => {
    try {
      const product = products.find(p => p.Id === productId);
      if (!product) return;

      const newStock = type === "add" 
        ? product.currentStock + quantity 
        : Math.max(0, product.currentStock - quantity);

      const updatedProduct = {
        ...product,
        currentStock: newStock,
        lastUpdated: new Date().toISOString()
      };

      await productService.update(productId, updatedProduct);
      
      setProducts(prev => prev.map(p => 
        p.Id === productId ? updatedProduct : p
      ));

      const actionText = type === "add" ? "increased" : "decreased";
      const stockText = type === "add" ? "added to" : "removed from";
      toast.success(`Stock ${actionText} by ${quantity} units for ${product.name}`);
    } catch (err) {
      toast.error("Failed to update stock level");
      console.error("Error updating stock:", err);
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products available"
        description="Add some products to your inventory before making stock adjustments."
        actionLabel="Go to Products"
        onAction={() => window.location.href = "/products"}
        icon="Package"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <QuickUpdateForm products={products} onStockAdjust={handleStockAdjust} />
    </motion.div>
  );
};

export default QuickUpdate;