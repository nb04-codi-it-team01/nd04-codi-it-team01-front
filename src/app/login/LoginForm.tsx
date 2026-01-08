"use client";

import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { LoginFormData, LoginSchema } from "@/lib/schemas/login.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  // 1. 상태 관리 (비밀번호 보이기/숨기기)
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-[50px]"
    >
      <div className="flex flex-col gap-[38px]">
        {/* 이메일 입력 (기존 유지) */}
        <div>
          <Input
            label="이메일"
            type="email"
            placeholder="이메일 주소 입력"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* 비밀번호 입력 (수정됨) */}
        <div>
          <div className="relative">
            <Input
              label="비밀번호"
              // 2. 상태에 따라 type 토글
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 입력"
              {...register("password")}
            />

            {/* 3. 눈 모양 버튼 위치 조정 */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              // 핵심 수정: top-1/2 대신 bottom 값을 사용하여 라벨을 피하고 입력 줄에 맞춤
              // right-0: 오른쪽 끝에 붙임 (필요시 right-2 등으로 미세 조정)
              // bottom-3: 입력창 높이에 맞춰 하단에서 띄움 (Input 패딩에 따라 2~4 사이로 조절해보세요)
              className="absolute right-0 bottom-3 p-1 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                // 눈 뜬 아이콘 (보일 때)
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
                // 눈 감은 아이콘 (숨길 때) - 빗금 추가
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

          {/* 에러 메시지는 relative 밖으로 빼서 원래 위치 유지 */}
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>
      </div>

      <Button
        label="로그인"
        size="large"
        variant="primary"
        type="submit"
        className="h-[4rem] w-[31.25rem]"
      />
    </form>
  );
}
