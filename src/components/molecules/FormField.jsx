import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = React.forwardRef(({ 
  label, 
  error, 
  className,
  required = false,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={props.id}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        ref={ref}
        error={!!error}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;