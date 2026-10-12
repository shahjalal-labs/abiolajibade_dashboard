/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import preview from "@/assets/Logo.png";
import logo from "@/assets/Logo.png";
import { useAdminLoginMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const route = useRouter();
  const [Login, { isLoading }] = useAdminLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await Login({
        email: values.email,
        password: values.password,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        Cookies.set("token", response.result.accessToken);
        route.push("/");
      }
    } catch (error) {
      toast.warning((error as any)?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Ocean Background */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-pink-200">
        <div className="flex items-center gap-4">
          <Image
            src={preview}
            alt="Hired Shift Staffing"
            height={296}
            width={296}
            className="h-40 w-40"
            priority
          />
          <div className="leading-tight">
            <h1
              className="text-2xl font-bold text-[#2D2D2D]"
              style={{ fontFamily: "cursive" }}
            >
              Hired Shift
            </h1>
            
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen bg-white border-l border-[#D1D6DB]">
        <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl">
          {/* Logo and Brand */}
          <div className="mb-8 md:mb-14 pl-6 md:pl-0">
            <Image
              src={logo}
              height={200}
              width={200}
              alt="Logo"
              className="lg:w-[150px] lg:h-[150px] w-[100px] h-[100px] rounded-lg"
              priority
            />
          </div>

          <div className="grow"></div>

          {/* Login Form */}
          <div className="p-8">
            <div className="text-start">
              <h2 className="text-[32px] font-semibold text-[#2D2D2D]">
                Login
              </h2>
              <p className="my-2.5 text-[#636F85]">
                Let’s login into your account first
              </p>
            </div>

            <form className="w-full" onSubmit={handleSubmit(handleLogin)}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#2D2D2D]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  className="h-12 w-full rounded-2xl border border-[#D1D6DB] px-4 text-sm outline-none transition focus:border-[#2D2D2D]"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#2D2D2D]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-2xl border border-[#D1D6DB] px-4 text-sm outline-none transition focus:border-[#2D2D2D]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => route.push("/reset-password")}
                className="w-full hover:underline cursor-pointer text-right text-sm font-medium text-bprimary"
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="disabled:opacity-45 disabled:cursor-default w-full mt-5 bg-bprimary text-white font-semibold rounded-3xl transition-all duration-500 ease-in-out cursor-pointer px-6 py-4"
              >
                {isLoading ? (
                  <Loader className="mx-auto animate-spin"></Loader>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>

          <div className="grow"></div>

          <div className="text-center text-sm cursor-pointer mt-20">
            <span className="text-[#2D2D2D]">
              © {new Date().getFullYear()} HIRED SHIFT STAFFING. All rights
              reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
