import React from 'react';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
import { useState } from 'react';

const Login = () => {
  const [isLoginForm, setisLoginForm] = useState(false)
  return (
    <div className="flex w-[70vw] h-[80vh] min-h-[70vh] bg-zinc-950 text-white font-poppins rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
      {/* Left Section - Image/Gradient */}
      <div className="hidden lg:flex w-1/2 p-4">
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('/magicpattern-87PP9Zd7MNo-unsplash.jpg')",
          }}
        >
          {/* Overlay to darken the image slightly if needed */}
          <div className="absolute w-full h-[40%] bottom-0 bg-linear-to-t from-black/50 to-transparent"></div>

          <div className="absolute bottom-12 left-12 right-12 z-10">
            {isLoginForm ? (
              <h1 className="text-6xl font-quera  mb-4  ">
                Welcome<br />Back
              </h1>
            ) : (
              <h1 className="text-6xl font-quera  mb-4  ">
                Welcome to<br />Queezy
              </h1>
            )}
            <p className="text-zinc-200 text-lg max-w-md">
              {isLoginForm ? "Log in to access your dashboard and continue your journey with us." : "Sign up to access your dashboard and continue your journey with us."}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        {
          isLoginForm ? (
            <LoginForm setisLoginForm={setisLoginForm} />
          ) : (
            <RegisterForm setisLoginForm={setisLoginForm} />
          )
        }
      </div>
    </div>
  );
};

export default Login;