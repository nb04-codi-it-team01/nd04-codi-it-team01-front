"use client";

import OrderInfoSection from "@/components/order/OrderInfoSection";
import OrderPointSection from "@/components/order/OrderPointSection";
import OrderProductList from "@/components/order/OrderProductList";
import OrderSummary from "@/components/order/OrderSummary";
import { getAxiosInstance } from "@/lib/api/axiosInstance";
import { useToaster } from "@/proviers/toaster/toaster.hook";
import { useOrderStore } from "@/store/orderStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function OrderPage() {
  const axiosInstance = getAxiosInstance();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedItems, getOrderRequest, reset } = useOrderStore();
  const isOrderCompleted = useRef(false);
  const toaster = useToaster();

  // 선택된 아이템이 없으면 장바구니 페이지로 리다이렉트
  useEffect(() => {
    if (selectedItems.length === 0 && !isOrderCompleted.current) {
      router.replace("/buyer/shopping");
    }
  }, [selectedItems, router]);

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = getOrderRequest();
      await axiosInstance.post("/orders", orderData);
    },
    onSuccess: async () => {
      // 1. 주문 완료 플래그 (useEffect 리다이렉트 방지)
      isOrderCompleted.current = true;

      // 2. 프론트엔드 스토어 초기화 (선택 상품 비우기)
      reset();

      // ⭐️ [중요] 서버 데이터 갱신 (장바구니 아이콘 숫자 업데이트용)
      // 백엔드가 지웠으니, 프론트의 캐시 데이터도 "상했다(invalid)"고 알려줘서 다시 받아오게 합니다.
      await queryClient.invalidateQueries({ queryKey: ["cart"] });

      // 3. 페이지 이동
      router.replace("/buyer/mypage");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: AxiosError<any>) => {
      // 1. 에러 응답 데이터가 있는지 확인
      const serverResponse = error.response?.data;

      // 2. 백엔드 errorHandler가 심어준 message 추출
      const errorMessage = serverResponse?.message || "주문 처리 중 오류가 발생했습니다.";

      // 3. 토스터나 얼럿으로 노출
      toaster("warn", errorMessage);

      // 디버깅을 위해 콘솔에 찍을 때도 data를 찍어야 함
      console.error("백엔드가 보낸 진짜 메시지:", errorMessage);
    },
  });

  return (
    <div>
      <div className="mx-auto h-full max-w-[1520px] bg-white pt-8">
        <div className="flex items-center gap-5">
          <h1 className="text-black01 flex items-center text-[1.75rem] font-extrabold">주문 및 결제</h1>
        </div>
        <div className="mt-8 flex gap-15">
          {/* 왼쪽: 주문 정보, 상품, 포인트 */}
          <div className="flex-1">
            <OrderInfoSection />
            <OrderProductList />
            <OrderPointSection />
          </div>

          {/* 오른쪽: 결제 요약 및 버튼 */}
          <OrderSummary onClick={() => createOrderMutation.mutate()} />
        </div>
      </div>
    </div>
  );
}
