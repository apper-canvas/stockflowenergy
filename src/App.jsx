import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Products from "@/components/pages/Products";
import QuickUpdate from "@/components/pages/QuickUpdate";

const AppContent = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  const getPageConfig = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: "Dashboard",
          showSearch: false
        };
      case "/products":
        return {
          title: "Products",
          showSearch: true,
          addButtonLabel: "Add Product"
        };
      case "/quick-update":
        return {
          title: "Quick Update",
          showSearch: false
        };
      default:
        return {
          title: "StockFlow",
          showSearch: false
        };
    }
  };

  const pageConfig = getPageConfig();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Layout
      title={pageConfig.title}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      showSearch={pageConfig.showSearch}
      addButtonLabel={pageConfig.addButtonLabel}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route 
          path="/products" 
          element={
            <Products 
              searchValue={searchValue}
            />
          } 
        />
        <Route path="/quick-update" element={<QuickUpdate />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </Router>
  );
};

export default App;