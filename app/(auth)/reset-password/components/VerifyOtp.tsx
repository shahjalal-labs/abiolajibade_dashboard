/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import preview from "@/assets/Logo.png";
import { useVerifyOTPMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type VerifyOtpFormValues = {
  otp: string;
};

export default function VerifyOtp({ setActive }: any) {
  const route = useRouter();
  const email = Cookies.get("email") ?? "";
  const [verifyOtp, { isLoading }] = useVerifyOTPMutation();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<VerifyOtpFormValues>({
    defaultValues: {
      otp: "",
    },
  });

  const handleVerifyOtp = async (values: VerifyOtpFormValues) => {
    try {
      const email = Cookies.get("email");
      const payload = email ? { email, otp: values.otp } : { otp: values.otp };
      const response = await verifyOtp(payload).unwrap();
     
      if (response.success) {
        toast.success(response.message);
        Cookies.remove("email");
        if (response.result?.accessToken) {
          Cookies.set("token", response.result.accessToken);
        }
        setActive("newPassword");
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
                Verify Code
              </h2>
              <p className="mt-2 pb-2 text-[#636F85]">
                Enter the 4-digit code sent to your email.
              </p>
              {email ? (
                <p className="text-sm pb-4 text-[#2D2D2D]">
                  Sent to <span className="font-semibold">{email}</span>
                </p>
              ) : null}
            </div>

            <form className="w-full" onSubmit={handleSubmit(handleVerifyOtp)}>
              <div className="mb-4">
                <Controller
                  control={control}
                  name="otp"
                  rules={{
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "OTP must be 4 digits",
                    },
                  }}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={4}
                      value={field.value}
                      onChange={field.onChange}
                      containerClassName="w-full"
                    >
                      <InputOTPGroup className="w-full justify-between">
                        <InputOTPSlot
                          index={0}
                          className="h-20 w-20 rounded-xl bg-[#F6F7FB] text-lg font-semibold text-[#2D2D2D]"
                        />
                        <InputOTPSlot
                          index={1}
                          className="h-20 w-20 rounded-xl bg-[#F6F7FB] text-lg font-semibold text-[#2D2D2D]"
                        />
                        <InputOTPSlot
                          index={2}
                          className="h-20 w-20 rounded-xl bg-[#F6F7FB] text-lg font-semibold text-[#2D2D2D]"
                        />
                        <InputOTPSlot
                          index={3}
                          className="h-20 w-20 rounded-xl bg-[#F6F7FB] text-lg font-semibold text-[#2D2D2D]"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.otp && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.otp.message}
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
                  "Verify Code"
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
