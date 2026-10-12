/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import Image from "next/image";
import preview from "@/assets/Logo.png";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

type LoginFormValues = {
  email: string;
};

export default function SendOtp({ setActive }: any) {
  const route = useRouter();
  const [sendOtp, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const handleSendOtp = async (values: LoginFormValues) => {
    try {
      const response = await sendOtp({
        email: values.email,
      }).unwrap();
      if (response.success) {
        toast.success(response.message);
        Cookies.set("email", values.email);
        setActive("verifyOtp");
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
              Home
            </h1>
            <h1 className="text-2xl font-bold text-[#2D2D2D]">
              Health Staffing
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center min-h-screen bg-white border-l border-[#D1D6DB]">
        <div className="w-full max-w-xl lg:max-w-lg xl:max-w-xl">
          <div className="grow"></div>

          {/* Login Form */}
          <div className="p-8">
            <div className="text-start">
              <h2 className="text-[32px] font-semibold text-[#2D2D2D]">
                Forgot Password
              </h2>
              <p className="mt-2 pb-2 text-[#636F85]">
                Enter your email and we will send a reset code.
              </p>
            </div>

            <form className="w-full" onSubmit={handleSubmit(handleSendOtp)}>
              <div className="mb-4">
                <input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  className="h-12 w-full rounded-xl border border-[#D1D6DB] px-4 text-sm outline-none transition focus:border-[#2D2D2D]"
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
              <button
                type="button"
                className="w-full  text-start text-sm font-medium  "
              >
                Remember your password?{" "}
                <span
                  className="text-bprimary hover:underline cursor-pointer"
                  onClick={() => route.push("/login")}
                >
                  Login
                </span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="disabled:opacity-45 disabled:cursor-default w-full mt-5 bg-bprimary text-white font-semibold rounded-3xl transition-all duration-500 ease-in-out cursor-pointer px-6 py-4"
              >
                {isLoading ? (
                  <Loader className="mx-auto animate-spin"></Loader>
                ) : (
                  "Send Code"
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
