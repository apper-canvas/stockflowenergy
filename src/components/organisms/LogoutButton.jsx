import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '@/App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="text-sm text-slate-600">
          Welcome, {user.firstName || user.name || 'User'}
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
      >
        <ApperIcon name="LogOut" className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;