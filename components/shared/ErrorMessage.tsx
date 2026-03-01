import React from "react";
import WarningIcon from "./WarningIcon";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  return (
    <div className={`mt-2 flex items-center text-red-600 ${className}`}>
      <WarningIcon className="mr-1 flex-shrink-0" size="sm" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default ErrorMessage;
