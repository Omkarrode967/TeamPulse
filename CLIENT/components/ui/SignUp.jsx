import React from 'react'
import { Form, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';


const SignUp = () => {

  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, setError, formState: { errors }, } = useForm();
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    setLoading(true);
    try {
    let r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/SignUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })
    // let res = await r.text()
    //  console.log(data, res)
    let res = await r.json();
    alert(res.message);

    if (res.success) {
      navigate("/SignIn");
    } else {
      alert("Signup failed: " + res.message);
    }

  }catch (err) {
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    

    <div
      className="min-h-screen flex items-center justify-center bg-blue-50 px-4"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm p-8 bg-white rounded shadow border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create your account</h2>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              id="username"
              type="text"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            {errors.username && (
              <p className="text-red-300 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              id="password"
              type="password"
              autoComplete="current-password"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmpassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              {...register("confirmpassword", {
                required: "Please confirm your password",
                validate: (value) => value === watch("password") || "Passwords do not match"
              })}
              id="confirmpassword"
              type="password"
              autoComplete="current-password"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            {errors.confirmpassword && (
              <p className="text-red-300 text-sm mt-1">{errors.confirmpassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              disabled={loading}
            >
               {loading ? "Signing up..." : "Sign up"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/SignIn" className="font-medium text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignUp
