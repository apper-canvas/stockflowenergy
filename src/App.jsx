import React, { createContext, useEffect, useState } from "react";
import { Route, Router, Routes, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store";
import { clearUser, setUser } from "@/store/userSlice";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import "@/index.css";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Products from "@/components/pages/Products";
import QuickUpdate from "@/components/pages/QuickUpdate";

// Create auth context
export const AuthContext = createContext(null);

const AppContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, []);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  const getPageConfig = () => {
    const location = window.location;
    const path = location.pathname;
    
    switch (path) {
      case "/":
        return { title: "Dashboard", showSearch: false, addButtonLabel: null };
      case "/products":
        return { title: "Products", showSearch: true, addButtonLabel: "Add Product" };
      case "/quick-update":
        return { title: "Quick Update", showSearch: false, addButtonLabel: null };
      default:
        return { title: "StockFlow", showSearch: false, addButtonLabel: null };
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  // If not authenticated, show auth routes
  if (!isAuthenticated) {
    return (
      <AuthContext.Provider value={authMethods}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthContext.Provider>
    );
  }

  const pageConfig = getPageConfig();

return (
    <AuthContext.Provider value={authMethods}>
      <Layout
        title={pageConfig.title}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        showSearch={pageConfig.showSearch}
        addButtonLabel={pageConfig.addButtonLabel}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products searchValue={searchValue} />} />
          <Route path="/quick-update" element={<QuickUpdate />} />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;