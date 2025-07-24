import React from "react";
import Badge from "@/components/atoms/Badge";

const StockBadge = ({ currentStock, lowStockThreshold = 10 }) => {
  const getStockStatus = () => {
    if (currentStock === 0) {
      return { variant: "error", text: "Out of Stock", level: "critical" };
    } else if (currentStock <= lowStockThreshold) {
      return { variant: "warning", text: "Low Stock", level: "low" };
    } else if (currentStock <= lowStockThreshold * 2) {
      return { variant: "primary", text: "Medium Stock", level: "medium" };
    } else {
      return { variant: "success", text: "In Stock", level: "high" };
    }
  };

  const status = getStockStatus();

  return (
    <Badge variant={status.variant}>
      {status.text} ({currentStock})
    </Badge>
  );
};

export default StockBadge;