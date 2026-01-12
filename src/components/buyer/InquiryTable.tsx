import cn from "@/proviers/toaster/utils/cn";
import { UserType } from "@/types/User";
import { Inquiry } from "@/types/inquiry";
import Image from "next/image";
import { useState } from "react";
import React from "react";
import InquiryAnswerModal from "../seller/InquiryAnswerModal";
import InquiryDeleteModal from "./InquiryDeleteModal";
import InquiryDetail from "./InquiryDetail";
import InquiryEditModal from "./InquiryEditModal";

interface InquiryTableProps {
  inquiries: Inquiry[];
  userType?: UserType;
}

export default function InquiryTable({ inquiries, userType }: InquiryTableProps) {
  const [editTargetId, setEditTargetId] = useState<Inquiry | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<Inquiry | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sellerModalType, setSellerModalType] = useState<"CompletedAnswer" | "WaitingAnswer">("WaitingAnswer");

  const handleCloseEdit = () => setEditTargetId(null);
  const handleCloseDelete = () => setDeleteTargetId(null);

  const handleRowClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const getStatusText = (status: Inquiry["status"]) => {
    switch (status) {
      case "CompletedAnswer":
        return "답변 완료";
      case "WaitingAnswer":
        return "대기 중";
      default:
        return status;
    }
  };
  return (
    <div className="border-black01 w-full border-t">
      <div className="text-black01 border-gray03 flex gap-20 border-b py-5 text-base font-bold">
        <div className="flex-1 text-center">상품명</div>
        <div className="w-25 text-start">작성일</div>
        <div className="flex-1 text-start">문의 제목</div>
        <div className="w-[100px] text-start">답변상태</div>
        <div className={cn("w-[128px]", userType === "SELLER" && "w-[157px]")}></div>
      </div>
      {inquiries.map((item, i) => {
        // ✅ 가독성을 위해 변수로 분리
        const isProductDeleted = !item.product || item.product.id === "" || item.product.name === "삭제된 상품입니다";
        // 판매자가 아니고(구매자), 상품이 삭제되었으면 수정 불가
        const isEditDisabled = isProductDeleted;

        return (
          <div
            key={`${item.id} ${i}`}
            onClick={() => handleRowClick(item.id)}
            className="border-gray04 relative flex w-full cursor-pointer flex-col items-center gap-5 border-b py-3"
          >
            <div className="flex w-full items-center gap-20">
              <div className="flex flex-1 items-center gap-5">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    // ✅ 이미지 에러 방지 로직 (?? -> || 변경 포함)
                    src={
                      item.product?.image || "/images/Mask-group.svg" // 상품 없으면 기본 이미지
                    }
                    alt={item.product?.name || "삭제된 상품"}
                    fill
                    className="rounded-xl object-cover"
                  />
                </div>
                <span className="text-black01 text-base font-normal">
                  {item.product?.name || "삭제된 상품입니다"} {/* ✅ 상품명 안전하게 표시 */}
                </span>
              </div>
              <div className="text-black01 w-25 flex-shrink-0 text-base font-normal">
                {new Date(item.createdAt).toISOString().split("T")[0]}
              </div>
              <div className="flex flex-1 items-center gap-1 text-start">
                {item.isSecret && (
                  <Image
                    src="/icon/icon_lock.svg"
                    alt="lock"
                    width={24}
                    height={24}
                  />
                )}
                <span className="text-black01 truncate text-base font-normal">{item.title}</span>
              </div>
              <div className="text-black01 w-[100px] text-start text-base font-normal">
                {getStatusText(item.status)}
              </div>

              {/* 버튼 영역 */}
              <div className={cn("flex w-[128px] gap-4", userType === "SELLER" && "w-[157px]")}>
                {item.status === "WaitingAnswer" && (
                  <button
                    // ✅ 1. 버튼 기능 비활성화
                    disabled={isEditDisabled}
                    className={cn(
                      "border-gray03 text-black01 hover:bg-black01 active:bg-black01 rounded-sm border px-3 py-[0.4375rem] text-base/4.5 font-bold transition-all duration-300 hover:text-white active:text-white",
                      // ✅ 2. 비활성화 스타일 (회색 처리, 호버 효과 제거)
                      isEditDisabled &&
                        "cursor-not-allowed border-gray-300 text-gray-400 opacity-70 hover:bg-white hover:text-gray-400 active:bg-white active:text-gray-400"
                    )}
                    onClick={(e) => {
                      // ✅ 3. 클릭 방지
                      if (isEditDisabled) return;
                      e.stopPropagation();
                      setEditTargetId(item);
                      setSellerModalType(item.status);
                    }}
                  >
                    {userType === "SELLER" ? "답변하기" : "수정"}
                  </button>
                )}

                {item.status === "CompletedAnswer" && userType === "SELLER" && (
                  <button
                    disabled={isEditDisabled}
                    className={cn(
                      "border-gray03 text-black01 hover:bg-black01 active:bg-black01 rounded-sm border px-3 py-[0.4375rem] text-base/4.5 font-bold transition-all duration-300 hover:text-white active:text-white",
                      isEditDisabled &&
                        "cursor-not-allowed border-gray-300 text-gray-400 opacity-70 hover:bg-white hover:text-gray-400 active:bg-white active:text-gray-400"
                    )}
                    onClick={(e) => {
                      if (isEditDisabled) return;
                      e.stopPropagation();
                      setEditTargetId(item);
                      setSellerModalType(item.status);
                    }}
                  >
                    수정하기
                  </button>
                )}

                {/* ✅ 유저 타입이 SELLER가 아닐 때만 삭제 버튼 노출 */}
                {userType !== "SELLER" && (
                  <button
                    className="border-gray03 text-black01 hover:bg-black01 active:bg-black01 rounded-sm border px-3 py-[0.4375rem] text-base/4.5 font-bold transition-all duration-300 hover:text-white active:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTargetId(item);
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
            {selectedId === item.id && <InquiryDetail inquiry={item} />}
          </div>
        );
      })}
      {userType === "SELLER" ? (
        <InquiryAnswerModal
          type={sellerModalType}
          open={!!editTargetId}
          inquiry={editTargetId}
          onClose={handleCloseEdit}
        />
      ) : (
        <InquiryEditModal
          open={!!editTargetId}
          inquiry={editTargetId}
          onClose={handleCloseEdit}
        />
      )}
      <InquiryDeleteModal
        open={!!deleteTargetId}
        inquiry={deleteTargetId}
        onClose={handleCloseDelete}
      />
    </div>
  );
}
