import { OrderItemResponse } from "@/types/order";
import Image from "next/image";
import { useState } from "react";
import Button from "../button/Button";
import ReviewViewModal from "./ReviewViewModal";
import ReviewWriteModal from "./ReviewWriteModal";

interface MypageItemCardProps {
  purchases: OrderItemResponse[];
}

export default function MypageItemCard({ purchases }: MypageItemCardProps) {
  const [reviewViewTarget, setReviewViewTarget] = useState<OrderItemResponse | null>(null);
  const [reviewWriteTarget, setReviewWriteTarget] = useState<OrderItemResponse | null>(null);

  const handleCloseView = () => setReviewViewTarget(null);
  const handleCloseWrite = () => setReviewWriteTarget(null);

  const handleReviewSubmit = () => {
    handleCloseWrite();
  };

  return (
    <div className="flex w-full flex-col gap-5">
      {purchases.map((item) => (
        <div
          key={item.id}
          className="border-gray03 flex items-end justify-between border-b bg-white pt-5 pb-6"
        >
          <div className="flex items-start gap-5">
            <div className="relative h-[5.625rem] w-[5.625rem]">
              <Image
                src={item.product.image ?? "/images/Mask-group.svg"}
                alt={item.product.name}
                fill
                className="rounded-xl object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-[0.625rem]">
                <div className="text-black01 text-base/4.5 font-extrabold">배송 완료</div>
                <div className="text-gray01 text-base/4.5 font-normal">구매일 : {new Date().toLocaleDateString()}</div>
                <div className="text-black01 text-base/4.5 font-bold">{item.product.name}</div>
              </div>
              <div className="flex gap-3">
                <div className="text-black01 text-base/4.5 font-normal">사이즈 : {item.size.size.ko}</div>
                <div className="flex items-center gap-[0.625rem]">
                  <span className="text-base/4.5 font-extrabold">{item.price.toLocaleString()}원</span>
                  <span className="text-gray01 text-base/4.5 font-normal">| {item.quantity}개</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            label={
              !item.productId // 상품 ID가 없으면
                ? "상품 정보 없음" //    -> "상품 정보 없음" 표시
                : item.isReviewed
                  ? "리뷰 보기"
                  : "리뷰 쓰기"
            }
            size="medium"
            variant="secondary"
            color={item.isReviewed ? "white" : "black"}
            //  1. [스타일 수정] disabled 상태일 때 회색 배경 + 클릭 금지 커서 적용
            className={`h-[3.75rem] w-[12.5rem] px-[1.875rem] py-[0.875rem] font-bold ${
              !item.productId ? "cursor-not-allowed border-none bg-gray-300 text-gray-500 hover:bg-gray-300" : ""
            }`}
            // 2. [기능 수정] disabled 속성 전달 (Button 컴포넌트가 지원한다면)
            disabled={!item.productId}
            onClick={() => {
              // 3. [방어 코드] 혹시나 클릭되더라도 함수를 즉시 종료
              if (!item.productId) return;

              if (item.isReviewed) setReviewViewTarget(item);
              else setReviewWriteTarget(item);
            }}
          />
        </div>
      ))}
      <ReviewViewModal
        open={!!reviewViewTarget}
        onClose={handleCloseView}
        purchase={reviewViewTarget}
      />
      <ReviewWriteModal
        open={!!reviewWriteTarget}
        onClose={handleCloseWrite}
        purchase={reviewWriteTarget}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
