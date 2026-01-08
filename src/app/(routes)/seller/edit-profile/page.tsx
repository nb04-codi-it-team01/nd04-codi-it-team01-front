"use client";

import MyPageMenu from "@/components/MyPageMenu";
import ProfileButton from "@/components/button/ProfileButton";
import ProfileInput from "@/components/input/ProfileInput";
import { menuItems } from "@/data/sellerMenuItems";
import { getAxiosInstance } from "@/lib/api/axiosInstance";
import { editUserProfile } from "@/lib/api/userProfile";
import { useToaster } from "@/proviers/toaster/toaster.hook";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/types/User";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditProfilePage() {
  const axiosInstance = getAxiosInstance();
  const [nickname, setNickname] = useState("");

  // ✅ 비밀번호 값 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ 비밀번호 보이기/숨기기 상태 (3개)
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedMenu, setSelectedMenu] = useState("editProfile");
  const [passwordError, setPasswordError] = useState("");
  const toaster = useToaster();
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const { data: user, refetch } = useQuery({
    queryKey: ["User"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<User>("/users/me");
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: editUserProfile,
    onSuccess: async () => {
      const { data: latestUser } = await refetch();
      if (latestUser) {
        setUser(latestUser);
      }
      toaster("info", "프로필 수정 성공");

      setNickname("");
      setSelectedImage(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    },
    onError: (error: AxiosError) => {
      console.error("mutation 에러 발생:", error.response?.data || error.message);
      toaster("warn", "수정에 실패했습니다.");
    },
  });

  const handleEditImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) setSelectedImage(file);
    };
    input.click();
  };

  const handleWithdrawClick = () => {
    alert("판매자 탈퇴는 진행 중인 주문 및 정산 내역 확인이 필요합니다.\n고객센터로 문의해 주세요.");
  };

  const isValid = currentPassword.trim() !== "";

  // ✅ 아이콘 컴포넌트 (재사용)
  const EyeIcon = () => (
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
  );

  const EyeOffIcon = () => (
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
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-[1520px] gap-10 pt-[3.75rem]">
        {/* 사이드 메뉴 */}
        <MyPageMenu
          items={menuItems}
          selectedId={selectedMenu}
          onSelect={(id, path) => {
            console.log("[seller] 클릭됨:", id, path);
            setSelectedMenu(id);
            router.push(path);
          }}
          className="h-[337.5px] w-[218px] flex-shrink-0"
        />

        {/* 본문 */}
        <div className="flex flex-col">
          <span className="text-black01 mb-6 text-[1.75rem] font-extrabold">내 정보 수정</span>

          {/* 프로필 이미지 */}
          <div className="relative mb-6 h-24 w-24">
            <Image
              src={selectedImage ? URL.createObjectURL(selectedImage) : user.image}
              alt={user.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="absolute right-0 bottom-0">
              <button
                onClick={handleEditImage}
                className="border-gray03 absolute right-0 bottom-0 flex h-[35px] w-[35px] items-center justify-center rounded-full border bg-white"
              >
                <Image
                  src="/icon/edit.svg"
                  alt="Edit Icon"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* 인풋 영역 */}
          <div className="flex flex-col gap-4">
            <ProfileInput
              label="이메일"
              value={user.email}
              onChange={() => {}}
              readOnly
            />
            <ProfileInput
              label="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={user.name}
            />

            {/* ✅ 1. 현재 비밀번호 */}
            <div className="relative">
              <ProfileInput
                label="현재 비밀번호"
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                // 말씀하신 bottom-2.5 적용
                className="absolute right-2 bottom-2.5 p-1 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPw ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>

            {/* ✅ 2. 새 비밀번호 입력 */}
            <div className="relative">
              <ProfileInput
                label="새 비밀번호 입력"
                type={showNewPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (newPassword && e.target.value !== newPassword) {
                    setPasswordError("비밀번호가 일치하지 않습니다.");
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholder="변경할 비밀번호 입력"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-2 bottom-2.5 p-1 text-gray-400 hover:text-gray-600"
              >
                {showNewPw ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>

            {/* ✅ 3. 새 비밀번호 확인 */}
            <div className="relative">
              <ProfileInput
                label="새 비밀번호 확인"
                type={showConfirmPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (confirmPassword && e.target.value !== confirmPassword) {
                    setPasswordError("비밀번호가 일치하지 않습니다.");
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholder="변경할 비밀번호 확인"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-2 bottom-2.5 p-1 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPw ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-6">
            <ProfileButton
              label="수정하기"
              onClick={() => {
                if (newPassword && newPassword !== confirmPassword) {
                  alert("새 비밀번호가 일치하지 않습니다.");
                  return;
                }

                updateMutation.mutate({
                  currentPassword,
                  nickname: nickname.trim() || undefined,
                  newPassword: newPassword.trim() || undefined,
                  imageFile: selectedImage || null,
                });
              }}
              disabled={!isValid || !!passwordError}
            />
          </div>

          {/* 셀러 탈퇴 안내 */}
          <div className="mt-10 flex justify-end border-t border-gray-200 pt-4">
            <button
              onClick={handleWithdrawClick}
              className="text-sm text-gray-400 underline decoration-gray-300 underline-offset-4 hover:text-gray-600 hover:decoration-gray-600"
            >
              판매자 입점 해지 / 탈퇴 문의
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
