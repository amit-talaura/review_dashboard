/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from "react";
import Input from "../../components/ui/Input";
import { useFormik } from "formik";
import { validation } from "../../validate/Validation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLoginDispatcher } from "../../features/login/LoginDispatcher";
import { FaEyeSlash, FaEye } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validation,
    onSubmit: async (values) => {
      try {
        const res = await dispatch(getLoginDispatcher(values));
        if (res?.payload?.status) navigate("/");
        else console.error("Login failed!");
      } catch (err) {
        console.error(err);
      }
    },
  });

  const renderInput = useCallback(
    ({ name, type, placeholder }) => (
      <div className="mb-4">
        <Input
          type={type === "password" && (showPassword ? "text" : "password")}
          name={name}
          placeholder={placeholder}
          value={loginForm.values[name]}
          onChange={loginForm.handleChange}
          onBlur={loginForm.handleBlur}
          className="w-full rounded-lg !py-3 placeholder:text-gray-600 text-black"
          icon={
            type === "password" &&
            (showPassword ? (
              <FaEye
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <FaEyeSlash
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ))
          }
        />

        {loginForm.touched[name] && loginForm.errors[name] && (
          <p className="text-red-500 text-[11px] pl-1">
            {loginForm.errors[name]}
          </p>
        )}
      </div>
    ),
    [loginForm, showPassword]
  );

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h1 className="text-5xl font-bold mb-6">
          The best offer <br />
          <span className="text-blue-300">for your business</span>
        </h1>
        <p className="text-blue-100">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
          itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora at
          cupiditate quis eum maiores libero veritatis? Dicta facilis sint
          aliquid ipsum atque?
        </p>
      </div>

      <div className="w-1/2 flex justify-center items-center px-10">
        <form
          className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-10 w-full max-w-md shadow-lg"
          onSubmit={loginForm.handleSubmit}
        >
          {renderInput({ name: "email", type: "email", placeholder: "Email" })}
          {renderInput({
            name: "password",
            type: "password",
            placeholder: "Password",
          })}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded-lg font-semibold mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
