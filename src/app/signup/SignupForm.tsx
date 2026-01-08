"use client";

import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { SignupFormData, SignupSchema } from "@/lib/schemas/signup.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  // ✅ 1. 상태 2개 추가 (비밀번호, 비밀번호 확인 각각 제어)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: "onTouched",
    defaultValues: {
      userType: "seller",
    },
  });
  const selectedType = watch("userType");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-[50px]"
    >
      <div className="flex flex-col gap-[38px]">
        {/* 이메일 (변경 없음) */}
        <div>
          <Input
            label="이메일"
            type="email"
            placeholder="이메일 주소 입력"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* 닉네임 (변경 없음) */}
        <div>
          <Input
            label="닉네임"
            type="name"
            placeholder="닉네임 입력"
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* ✅ 비밀번호 입력 (수정됨) */}
        <div>
          <div className="relative">
            <Input
              label="비밀번호"
              // showPassword 상태에 따라 type 변경
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 입력"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-3 p-1 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                // 눈 뜬 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                // 눈 감은 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {/* ✅ 비밀번호 확인 입력 (수정됨) */}
        <div>
          <div className="relative">
            <Input
              label="비밀번호 확인"
              // showConfirmPassword 상태 사용
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호 확인"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 bottom-3 p-1 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                // 눈 뜬 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ) : (
                // 눈 감은 아이콘
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {/* 회원 유형 선택 (변경 없음) */}
        <div className="flex flex-col gap-5 text-base font-bold">
          <span>회원 유형</span>
          <div className="flex gap-4">
            {["seller", "buyer"].map((type) => (
              <label
                key={type}
                htmlFor={`userType-${type}`}
                className={`relative flex h-[60px] w-[240px] cursor-pointer items-center justify-between rounded-xl border transition-all ${
                  selectedType === type ? "border-black01 opacity-100" : "border-gray-300 opacity-50"
                } `}
              >
                <input
                  type="radio"
                  id={`userType-${type}`}
                  value={type}
                  {...register("userType")}
                  className="hidden"
                />
                <span className="py-[21px] pl-[30px]">{type === "seller" ? "셀러" : "바이어"}</span>
                {selectedType === type && (
                  <Image
                    src="/icon_check.svg"
                    alt="check"
                    width={28}
                    height={28}
                    className="mr-[16px]"
                  />
                )}
              </label>
            ))}
          </div>
          {errors.userType && <p className="mt-1 text-sm text-red-500">{errors.userType.message}</p>}
        </div>
      </div>
      <Button
        label="회원가입"
        size="large"
        variant="primary"
        type="submit"
        className="h-[4rem] w-[31.25rem]"
      />
    </form>
  );
}
