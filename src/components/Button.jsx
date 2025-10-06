const Button = ({ children, variant, size, className, onClick }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50";
      case "ghost":
        return "bg-transparent hover:bg-gray-100 text-gray-700";
      default:
        return "bg-blue text-white hover:bg-blue-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "icon":
        return "p-1";
      default:
        return "text-sm px-4 py-2";
    }
  };

  return (
    <button
      className={`font-medium rounded-md inline-flex items-center justify-center cursor-pointer ${getVariantClasses()} ${getSizeClasses()} ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
