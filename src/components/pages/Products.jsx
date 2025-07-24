import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductTable from "@/components/organisms/ProductTable";
import ProductModal from "@/components/organisms/ProductModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService"; 
import { toast } from "react-toastify";

const Products = ({ searchValue, onAddClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

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

  useEffect(() => {
    if (onAddClick) {
      // This allows parent to trigger modal open
      onAddClick(() => {
        setEditingProduct(null);
        setIsModalOpen(true);
      });
    }
  }, [onAddClick]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

const handleSaveProduct = async (productData) => {
    try {
      setModalLoading(true);
      
      if (editingProduct) {
        const updatedProduct = await productService.update(editingProduct.Id, productData);
        if (updatedProduct) {
          setProducts(prev => prev.map(p => p.Id === editingProduct.Id ? updatedProduct : p));
          toast.success("Product updated successfully!");
          setIsModalOpen(false);
          setEditingProduct(null);
        }
      } else {
        const newProduct = await productService.create(productData);
        if (newProduct) {
          setProducts(prev => [...prev, newProduct]);
          toast.success("Product added successfully!");
          setIsModalOpen(false);
          setEditingProduct(null);
        }
      }
    } catch (err) {
      toast.error(editingProduct ? "Failed to update product" : "Failed to add product");
      console.error("Error saving product:", err);
    } finally {
      setModalLoading(false);
    }
  };

const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const success = await productService.delete(productId);
      if (success) {
        setProducts(prev => prev.filter(p => p.Id !== productId));
        toast.success("Product deleted successfully!");
      }
    } catch (err) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", err);
    }
  };

const handleStockAdjust = async (productId, type, quantity, notes = "") => {
    try {
      const updatedProduct = await productService.adjustStock(productId, type, quantity, notes);
      if (updatedProduct) {
        setProducts(prev => prev.map(p => 
          p.Id === productId ? updatedProduct : p
        ));
        toast.success(`Stock ${type === "add" ? "increased" : "decreased"} by ${quantity} units`);
      }
    } catch (err) {
      toast.error("Failed to update stock level");
      console.error("Error updating stock:", err);
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;

    // Apply search filter
    if (searchValue && searchValue.trim()) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(product => {
        switch (filterStatus) {
          case "low":
            return product.currentStock <= product.lowStockThreshold && product.currentStock > 0;
          case "out":
            return product.currentStock === 0;
          case "normal":
            return product.currentStock > product.lowStockThreshold;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        description="Start building your inventory by adding your first product."
        actionLabel="Add Product"
        onAction={handleAddProduct}
        icon="Package"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Filter by Stock Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Products ({products.length})</option>
              <option value="normal">Normal Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Results Summary */}
      {(searchValue || filterStatus !== "all") && (
        <div className="text-sm text-slate-600">
          Showing {filteredProducts.length} of {products.length} products
          {searchValue && ` matching "${searchValue}"`}
        </div>
      )}

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onStockAdjust={handleStockAdjust}
        />
      ) : (
        <Empty
          title="No products match your filters"
          description="Try adjusting your search terms or filters to find products."
          actionLabel="Clear Filters"
          onAction={() => {
            setFilterStatus("all");
          }}
          icon="Search"
        />
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        isLoading={modalLoading}
      />
    </motion.div>
  );
};

export default Products;