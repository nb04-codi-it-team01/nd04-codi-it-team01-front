import Stars from "@/app/(routes)/products/[productId]/components/Stars";
import Modal from "@/components/Modal";
import { getAxiosInstance } from "@/lib/api/axiosInstance";
import { useToaster } from "@/proviers/toaster/toaster.hook";
import { useUserStore } from "@/stores/userStore";
import { OrderItemResponse } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../button/Button";
import Divder from "../divider/Divder";

interface ReviewViewModalProps {
  open: boolean;
  onClose: () => void;
  purchase: OrderItemResponse | null;
}

export default function ReviewViewModal({ open, onClose, purchase }: ReviewViewModalProps) {
  const axiosInstance = getAxiosInstance();
  const queryClient = useQueryClient();
  const toaster = useToaster();
  const user = useUserStore((state) => state.user);

  // ✅ [State] 수정 모드 및 입력값 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  const review = purchase?.product.reviews[0];

  // ✅ 모달이 열리거나 purchase가 바뀔 때 초기값 세팅
  useEffect(() => {
    if (open && review) {
      setIsEditing(false);
      setEditContent(review.content);
      setEditRating(review.rating);
    }
  }, [open, review]);

  // ✅ [Delete] 리뷰 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!review) return;
      await axiosInstance.delete(`/review/${review.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mypage-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toaster("info", "리뷰가 삭제됐습니다.");
      onClose();
    },
  });

  // ✅ [Patch] 리뷰 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!review) return;
      await axiosInstance.patch(`/review/${review.id}`, {
        rating: editRating,
        content: editContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mypage-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toaster("info", "리뷰가 수정되었습니다.");
      setIsEditing(false); // 수정 모드 종료
      onClose(); // 혹은 모달 닫기
    },
    onError: () => {
      toaster("warn", "리뷰 수정에 실패했습니다.");
    },
  });

  // ✅ [Helper] 수정 여부 확인 함수
  const isModified = (created: string, updated: string | undefined) => {
    if (!updated) return false;
    // 생성 시간보다 수정 시간이 더 뒤라면 수정된 것으로 간주
    return new Date(updated).getTime() > new Date(created).getTime();
  };

  if (!purchase || !review) return null;

  const handleDelete = () => {
    if (confirm("정말로 리뷰를 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  const handleUpdate = () => {
    if (editContent.trim().length < 10) {
      toaster("warn", "리뷰는 최소 10자 이상 입력해주세요.");
      return;
    }
    updateMutation.mutate();
  };

  // ✅ 별점 클릭 핸들러 (수정 모드용)
  const handleStarClick = (rating: number) => {
    setEditRating(rating);
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
    >
      <div className="relative w-[600px]">
        <button
          className="absolute top-0 right-0"
          onClick={onClose}
        >
          <Image
            src="/icon/deleteBlack.svg"
            alt="닫기"
            width={24}
            height={24}
          />
        </button>

        <div className="text-black01 mb-5 text-[1.75rem] font-extrabold">{isEditing ? "리뷰 수정" : "작성한 리뷰"}</div>
        <Divder className="mb-10" />

        <div className="mb-10 flex flex-col gap-6">
          {/* 상품 정보 (공통) */}
          <div className="flex gap-2.5">
            <div className="relative h-[6.875rem] w-25">
              <Image
                src={purchase.product.image ?? "/images/Mask-group.svg"}
                fill
                alt="CODI-IT"
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="flex flex-col gap-[0.625rem]">
                <div className="text-gray01 text-base/5 font-normal">구매일 : {new Date().toLocaleDateString()}</div>
                <div className="text-black01 text-lg/5 font-bold">{purchase.product.name}</div>
              </div>
              <div className="text-black01 text-lg/5 font-normal">사이즈 : {purchase.size.size.ko}</div>
              <div className="flex items-center gap-[0.625rem]">
                <span className="text-lg/5 font-extrabold">{purchase.price.toLocaleString()}원</span>
                <span className="text-gray01 text-base/4.5 font-normal">| {purchase.quantity}개</span>
              </div>
            </div>
          </div>

          {/* ✅ 내용 분기: 수정 모드 vs 조회 모드 */}
          {isEditing ? (
            // [수정 모드 UI]
            <div className="flex flex-col gap-4">
              {/* 인터랙티브 별점 (클릭 가능) */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    type="button"
                  >
                    <Image
                      src={star <= editRating ? "/icon/starYellow.svg" : "/icon/starGray.svg"}
                      alt={`${star}점`}
                      width={32}
                      height={32}
                    />
                  </button>
                ))}
              </div>

              {/* 텍스트 입력창 */}
              <textarea
                className="h-[150px] w-full resize-none rounded border border-gray-300 p-4 text-base outline-none focus:border-black"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="리뷰를 작성해주세요 (최소 10자 이상)"
              />
              <p className="text-sm text-gray-500">최소 10자 이상 입력해주세요.</p>
            </div>
          ) : (
            // [조회 모드 UI]
            <div className="flex flex-col gap-4">
              <Stars
                size="normal"
                rating={review.rating}
              />
              <div className="flex items-center gap-1">
                <span className="text-black01 text-base/4.5 font-bold">
                  {review.user?.name ?? user?.name ?? "구매자"}
                </span>
                <span className="text-gray01 text-base/4.5 font-normal">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* ✅ (수정됨) 표시 로직 적용 */}
              <p className="text-black01 text-lg font-normal whitespace-pre-wrap">
                {review.content}
                {review.updatedAt && isModified(review.createdAt, review.updatedAt) && (
                  <span className="ml-2 text-xs font-normal text-gray-400">(수정됨)</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* ✅ 버튼 영역 분기 */}
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                label="취소"
                size="large"
                variant="secondary" // 혹은 outline 스타일
                className="h-15 flex-1 bg-gray-200 text-black hover:bg-gray-300"
                onClick={() => setIsEditing(false)}
              />
              <Button
                label="저장하기"
                size="large"
                variant="primary"
                className="h-15 flex-1"
                onClick={handleUpdate}
              />
            </>
          ) : (
            <>
              <Button
                label="수정"
                size="large"
                variant="secondary"
                color="white"
                className="h-15 flex-1 border border-gray-300"
                onClick={() => setIsEditing(true)}
              />
              <Button
                label="리뷰 삭제"
                size="large"
                variant="secondary" // 혹은 danger 스타일
                color="white"
                className="h-15 flex-1 border border-gray-300 text-red-500 hover:bg-red-50"
                onClick={handleDelete}
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
