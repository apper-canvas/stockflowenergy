import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardCards from "@/components/organisms/DashboardCards";
import ProductTable from "@/components/organisms/ProductTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ui/ApperIcon";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const Dashboard = () => {
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

      toast.success(`Stock ${type === "add" ? "increased" : "decreased"} by ${quantity} units`);
    } catch (err) {
      toast.error("Failed to update stock level");
      console.error("Error updating stock:", err);
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => 
      p.currentStock <= p.lowStockThreshold && p.currentStock > 0
    ).length;
    const outOfStockCount = products.filter(p => p.currentStock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.currentStock), 0);

    return { totalProducts, lowStockCount, outOfStockCount, totalValue };
  };

  const getLowStockProducts = () => {
    return products
      .filter(p => p.currentStock <= p.lowStockThreshold)
      .sort((a, b) => a.currentStock - b.currentStock)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="cards" />
        <Loading type="table" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products in inventory"
        description="Start by adding your first product to begin tracking inventory."
        actionLabel="Add First Product"
        onAction={() => window.location.href = "/products"}
        icon="Package"
      />
    );
  }

  const stats = calculateStats();
  const lowStockProducts = getLowStockProducts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <DashboardCards stats={stats} />

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-warning-800">Low Stock Alert</h3>
          </div>
          <p className="text-warning-700 mb-4">
            {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} running low on stock
          </p>
          <div className="space-y-2">
            {lowStockProducts.map(product => (
              <div key={product.Id} className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-md">
                <span className="font-medium text-warning-900">{product.name}</span>
                <span className="text-sm text-warning-700">
                  {product.currentStock} units remaining
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Products Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Products</h2>
          <a
            href="/products"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View all products →
          </a>
        </div>
        <ProductTable
          products={products.slice(0, 10)}
          onStockAdjust={handleStockAdjust}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </motion.div>
  );
};

export default Dashboard;