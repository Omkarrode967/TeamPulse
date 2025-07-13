import React from 'react';
import { Form, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';

const SignIn = () => {

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setError, formState: { errors }, } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
    let r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/SignIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })
    let res = await r.json();
    alert(res.message);

    if (res.success) {
      // Store token in localStorage
      localStorage.setItem('token', res.token);
      // Update auth context
      login({ email: data.email, token: res.token });
      navigate("/Dashboard");
    } else {
      alert("Signin failed: " + res.message);
    }

  }catch (err) {
    alert("Something went wrong.");
  } finally {
    setLoading(false); // Stop loader
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign in to your account</h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium ">
                Email address
              </label>
              <input
                {...register("email", { required: { value: true, message: "This field is required" } })}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
               
              </div>
              <input
                {...register("password", { required: { value: true, message: "This field is required" } })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              value="submit"
              className="w-full py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* SignUp Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{' '}
          <Link to="/SignUp" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
