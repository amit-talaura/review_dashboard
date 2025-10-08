const Badge = ({ children, className, onClick }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm whitespace-nowrap ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default Badge;
