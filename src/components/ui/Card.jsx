const Card = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
