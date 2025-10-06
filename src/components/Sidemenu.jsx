import React, { useState, useCallback, useEffect } from "react";
import { menuOptions } from "../constants/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useDispatch } from "react-redux";
import { logout } from "../features/login/LoginSlice";
import Modal from "./ui/Modal";
import PopupNotifications from "./ui/PopupNotifications";

const Sidemenu = ({ setSelectedChild, selectedChild }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const isMenuActive = (menuLink, options) => {
    if (options?.length) {
      return options.some(
        (option) =>
          location.pathname === option.link ||
          location.pathname.startsWith(option.link + "/")
      );
    }

    if (menuLink === "/metric") {
      return (
        location.pathname === "/metric" ||
        location.pathname.startsWith("/create-metric") ||
        location.pathname.startsWith("/verify-metric")
      );
    }
    return (
      location.pathname === menuLink ||
      location.pathname.startsWith(menuLink + "/")
    );
  };

  const handleChildClick = useCallback((menu) => {
    setSelectedChild(menu);
  }, []);

  useEffect(() => {
    if (location?.pathname.endsWith("metric")) {
      setSelectedChild("");
    }
  }, [location?.pathname, setSelectedChild]);

  useEffect(() => {
    setSelectedChild("Conversation");
  }, [setSelectedChild]);

  return (
    <div className="w-80 pt-4 border-r border-gray-300 relative">
      <ul className="px-2">
        {menuOptions.map((menu) => {
          const active = isMenuActive(menu.link, menu.options);

          return (
            <li
              key={menu.id}
              className={`relative ${
                !menu.options && "hover:bg-[#E9F2FE]"
              } duration-150 transition-all rounded-md my-1 overflow-hidden ${
                !menu.options && active ? "bg-[#E9F2FE]" : ""
              }`}
              onClick={() => !menu.options && setSelectedChild("")}
            >
              {!menu?.options && (
                <div
                  className={`bg-blue w-[4px] absolute ${
                    menu.options ? "top-5 h-[25%]" : "top-1/2 h-[50%]"
                  } left-0 rounded-br-md rounded-tr-md duration-150 transition-all ${
                    active
                      ? "-translate-y-1/2 opacity-100"
                      : "-translate-y-20 opacity-0"
                  }`}
                />
              )}

              <Link
                className={`p-3 flex items-start flex-col ${
                  menu.menu === "Dashboard" ? "cursor-auto" : "cursor-pointer"
                }`}
                to={menu.link}
              >
                <span
                  className={`ml-4 text-sm font-medium ${
                    !menu.options && active
                      ? "text-[#1868DB]"
                      : "text-[#505258]"
                  }`}
                >
                  {menu.menu}
                </span>

                {menu.options && (
                  <div className="ml-8 flex flex-col gap-2 w-[90%] mt-2">
                    {menu.options.map((option, index) => {
                      const optionActive = selectedChild === option?.menu;
                      return (
                        <Link
                          key={index}
                          to={option?.link}
                          onClick={() => handleChildClick(option?.menu)}
                          className={`relative overflow-hidden py-2.5 px-3 text-sm rounded-md font-medium cursor-pointer hover:bg-[#E9F2FE] hover:text-[#1868DB] ${
                            optionActive
                              ? "bg-[#E9F2FE] text-[#1868DB]"
                              : "text-[#505258]"
                          }`}
                        >
                          <div
                            className={`w-1 h-6 bg-blue absolute top-1/2 left-0 duration-150 transition-all rounded-tr-full rounded-br-full ${
                              optionActive
                                ? "-translate-y-1/2 opacity-100"
                                : "-translate-y-20 opacity-0"
                            }`}
                          />
                          <span
                            className={`flex gap-2 items-start justify-start ${
                              optionActive ? "text-[#1868DB]" : ""
                            }`}
                          >
                            {option?.menu}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-center items-center mt-auto w-full absolute bottom-4">
        <Button
          text="Sign Out"
          className="bg-gray-400 text-white"
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <Modal className="bg-black/30">
          <PopupNotifications
            notificationMessage="Are you sure want to logout ?"
            color={"bg-red"}
            onClose={() => setShowModal(false)}
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Sidemenu;
