"use client";

import MyPageMenu from "@/components/MyPageMenu";
import ProfileButton from "@/components/button/ProfileButton";
import ProfileInput from "@/components/input/ProfileInput";
import { menuItems } from "@/data/buyerMenuItems";
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
  const [nickname, setNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedMenu, setSelectedMenu] = useState("editProfile");
  const [passwordError, setPasswordError] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");

  const toaster = useToaster();
  const router = useRouter();
  const axiosInstance = getAxiosInstance();
  // ✅ [수정 1] setUser뿐만 아니라 logout도 가져옵니다.
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);

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
      const { data: latestUser } = await refetch(); // 최신 유저 데이터 받아오고
      if (latestUser) {
        setUser(latestUser); // zustand 상태 업데이트
      }
      toaster("info", "프로필 수정 성공");

      // 인풋창 상태 전부 초기화
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

  // ✅ [수정 2] 회원 탈퇴 핸들러 함수 추가
  const handleWithdraw = async () => {
    if (!withdrawPassword.trim()) {
      toaster("warn", "비밀번호를 입력해주세요.");
      return;
    }

    try {
      // DELETE 요청은 body를 보낼 때 'data' 옵션을 사용해야 합니다.
      await axiosInstance.delete("/users/delete", {
        data: { currentPassword: withdrawPassword }, // 백엔드로 비밀번호 전송
      });

      setIsWithdrawModalOpen(false); // 모달 닫기
      logout(); // 로그아웃
      toaster("info", "회원 탈퇴가 완료되었습니다.");
      router.replace("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("회원 탈퇴 실패:", error);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message; // 백엔드에서 보낸 message

      if (status === 401 || status === 400) {
        // 백엔드 메시지가 있으면 그걸 쓰고, 없으면 기본 메시지 출력
        toaster("warn", serverMessage || "비밀번호가 일치하지 않습니다.");
      } else {
        toaster("warn", "회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  const handleEditImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) setSelectedImage(file);
    };
    input.click();
  };

  const isValid = currentPassword.trim() !== "";

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-[1520px] gap-10 pt-[3.75rem]">
        {/* 사이드 메뉴 */}
        <MyPageMenu
          items={menuItems}
          selectedId={selectedMenu}
          onSelect={(id, path) => {
            setSelectedMenu(id);
            router.push(path);
          }}
          className="h-[280px] w-[218px] flex-shrink-0"
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
                  alt="Edit"
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
            <ProfileInput
              label="현재 비밀번호"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호 입력"
            />
            <ProfileInput
              label="새 비밀번호 입력"
              type="password"
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
            <ProfileInput
              label="새 비밀번호 확인"
              type="password"
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
                  imageFile: selectedImage || null, // 이미지 파일 전달
                });
              }}
              disabled={!isValid || !!passwordError}
            />
          </div>

          <div className="mt-10 flex justify-end border-t border-gray-200 pt-4">
            <button
              onClick={() => setIsWithdrawModalOpen(true)} // ✅ 모달 열기
              className="text-sm text-gray-500 underline decoration-gray-400 underline-offset-4 hover:text-red-600 hover:decoration-red-600"
            >
              회원 탈퇴하기
            </button>
          </div>
        </div>
      </div>
      {/* ✅ [추가 3] 탈퇴 확인 모달 (JSX 맨 아래 </div> 바로 위에 넣으세요) */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[400px] rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-red-600">회원 탈퇴</h2>
            <p className="text-gray02 mt-2 text-sm">
              탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
              <br />
              본인 확인을 위해 <strong>현재 비밀번호</strong>를 입력해 주세요.
            </p>

            <div className="mt-4">
              <input
                type="password"
                value={withdrawPassword}
                onChange={(e) => setWithdrawPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="border-gray03 w-full rounded border px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsWithdrawModalOpen(false);
                  setWithdrawPassword(""); // 비밀번호 초기화
                }}
                className="rounded px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleWithdraw}
                className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
