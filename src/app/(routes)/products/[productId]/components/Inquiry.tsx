"use client";

import formatDate from "@/lib/functions/dateFormat";
import { useUserStore } from "@/stores/userStore";
import { InquiryData } from "@/types/inquiry";
import Image from "next/image";
import { useState } from "react";

// 맨 위에 추가

interface InquiryProps {
  inquiry: InquiryData;
  storeOwnerId: string;
}

const Inquiry = ({ inquiry, storeOwnerId }: InquiryProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useUserStore();

  // ✅ 권한 체크 로직 추가
  const isWriter = user ? String(user.id) === String(inquiry.userId) : false;
  const isSeller = user ? String(user.id) === String(storeOwnerId) : false;
  console.log("User Object:", user);
  // 비밀글이 아니거나, 작성자거나, 판매자면 볼 수 있음
  const canRead = !inquiry.isSecret || isWriter || isSeller;

  const handleToggle = () => {
    // ✅ canRead 조건으로 변경
    if (!canRead) {
      alert("비밀글은 작성자와 판매자만 확인할 수 있습니다."); // UX 개선용 알림
      return;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`border-gray04 text-black02 flex cursor-pointer border-b py-7.5 text-center text-lg leading-none ${isOpen && inquiry.status && "bg-gray05"}`}
      onClick={handleToggle}
    >
      <p className="w-1/5">{inquiry.user?.name}</p>
      <p className="w-1/10">{formatDate(inquiry.createdAt)}</p>

      {/* ✅ isOpen 조건만 남기고, 내부에서 분기 처리 */}
      {isOpen ? (
        <div className="w-1/2 space-y-10 pl-25 text-left text-base leading-relaxed">
          <div className="flex gap-5">
            <div className="text-[1.75rem] leading-none font-extrabold">Q.</div>
            <div className="space-y-3">
              <p className="font-bold">{inquiry.title}</p>
              <p className="">{inquiry.content}</p>
            </div>
          </div>
          {inquiry.status === "CompletedAnswer" && (
            <div className="flex gap-5">
              <div className="text-[1.75rem] leading-none font-extrabold">A.</div>
              <p>
                {inquiry.reply?.content.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      ) : (
        // 닫혀있을 때 (목록에 보이는 부분)
        <p className={`flex w-1/2 items-center gap-2 pl-25 text-left ${!canRead ? "text-gray01" : ""}`}>
          {/* ✅ LockIcon 컴포넌트 대신 프로젝트에 있는 이미지를 사용 */}
          {inquiry.isSecret && (
            <Image
              src="/icon/icon_lock.svg"
              alt="secret"
              width={16} // 텍스트 크기에 맞춰 조절 (보통 16~20)
              height={16}
              className="mb-0.5" // 텍스트와 높이 맞춤 보정
            />
          )}

          {/* 텍스트 표시 */}
          <span>{!canRead ? "비밀글입니다." : inquiry.title}</span>
        </p>
      )}

      <p className="w-1/5">{inquiry.status === "WaitingAnswer" ? "대기 중" : "답변완료"}</p>
    </div>
  );
};

export default Inquiry;
