import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const RegisterForm = ({setisLoginForm}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {handleRegister} = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await handleRegister(data);
    if (success) {
      setisLoginForm(true);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="text-3xl font-semibold mb-2">Sign Up</h2>
        <p className="text-zinc-400 text-sm">
          Enter your personal data to create your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Fullname Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 block">
            Full Name
          </label>
          <input
            type="text"
            placeholder="eg. John Francisco"
            className={`w-full px-4 py-3 bg-zinc-900 border ${
              errors.fullname ? 'border-red-500' : 'border-zinc-800'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors text-white placeholder-zinc-500`}
            {...register('fullname', {
              required: 'Full name is required',
              minLength: {
                value: 3,
                message: 'Full name must be at least 3 characters',
              },
            })}
          />
          {errors.fullname && (
            <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 block">
            Email
          </label>
          <input
            type="email"
            placeholder="eg. johnfrans@gmail.com"
            className={`w-full px-4 py-3 bg-zinc-900 border ${
              errors.email ? 'border-red-500' : 'border-zinc-800'
            } rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors text-white placeholder-zinc-500`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 bg-zinc-900 border ${
                errors.password ? 'border-red-500' : 'border-zinc-800'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-colors text-white placeholder-zinc-500`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-white text-zinc-950 font-medium rounded-xl hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          Sign Up
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <div className="relative bg-zinc-950 px-4 text-sm text-zinc-500">
          Or
        </div>
      </div>

      {/* Google Login */}
      <button
        type="button"
        className="w-full py-3 px-4 bg-transparent border border-zinc-800 hover:bg-zinc-900 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-zinc-700"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Footer Link */}
      <p className="text-center text-sm text-zinc-400 mt-8">
        Already have an account?{' '}
        <button onClick={() => setisLoginForm(true)} className="text-white font-medium hover:underline">
          Log in
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;