import React from "react";

const PopupNotifications = ({
  notificationMessage,
  onClose,
  onClick,
  color,
}) => {
  return (
    <div className="rounded shadow bg-white overflow-hidden">
      <div className={`${color || "bg-blue"} p-4`}>
        <p className=" text-xl text-center text-white font-medium">
          {notificationMessage}
        </p>
      </div>
      <div className="m flex justify-between items-center gap-8 p-6">
        <button
          className="w-28 py-1.5 text-center border border-black text-black rounded cursor-pointer"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className={`w-28 py-2 text-center ${
            color || "bg-blue"
          } rounded cursor-pointer text-white`}
          onClick={onClick}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export default PopupNotifications;
