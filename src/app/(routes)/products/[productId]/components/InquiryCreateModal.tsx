import Modal from "@/components/Modal";
import Button from "@/components/button/Button";
import Divder from "@/components/divider/Divder";
import BoxInput from "@/components/input/BoxInput";
import TextArea from "@/components/input/TextArea";
import { PostInquiryParams, getProductDetail, postProductInquiry } from "@/lib/api/products";
import { inquiryCreateForm, inquiryCreateSchemas } from "@/lib/schemas/inquiryCreate.schemas";
import { useToaster } from "@/proviers/toaster/toaster.hook";
import { useUserStore } from "@/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

interface InquiryCreateModalProps {
  productId: string;
  onClose: () => void;
}

export default function InquiryCreateModal({ productId, onClose }: InquiryCreateModalProps) {
  const user = useUserStore((state) => state.user);
  const toaster = useToaster();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<inquiryCreateForm>({
    resolver: zodResolver(inquiryCreateSchemas),
    defaultValues: {
      title: "",
      content: "",
      isSecret: false,
    },
  });
  const isSecret = watch("isSecret");

  const { data: productData } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetail(productId),
  });

  const isSeller = user?.type === "SELLER";

  const mutation = useMutation({
    mutationFn: (data: PostInquiryParams) => postProductInquiry(data),
    onSuccess: () => {
      toaster("info", "문의가 성공적으로 등록되었습니다.");
      onClose();
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toaster("warn", "로그인이 필요합니다.");
        onClose();
      } else {
        toaster("warn", "문의 등록에 실패했습니다.");
        onClose();
      }
    },
  });

  const onSubmit = (formData: inquiryCreateForm) => {
    // ✅ 판매자면 차단
    if (isSeller) {
      toaster("error", "판매자 계정으로는 문의를 등록할 수 없습니다.");
      return;
    }
    mutation.mutate({ productId, ...formData });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
    >
      <div className="text-black01 relative text-[1.75rem] leading-none font-extrabold">
        <h2>상품 문의</h2>
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
      </div>
      <Divder className="mt-5 mb-10" /> {/* 본인 상품일 경우 경고 문구 표시 */}
      {isSeller && (
        <div className="mb-5 rounded-md bg-red-50 p-3 text-sm font-bold text-red-500">
          ※ 판매자 계정으로는 상품 문의를 이용할 수 없습니다.
        </div>
      )}
      <div className="mb-10 flex w-130 gap-5">
        {productData && (
          <Image
            className="h-20 w-20 rounded-md object-cover"
            src={productData?.image}
            alt="image"
            width={80}
            height={80}
          />
        )}
        <div className="flex w-105 flex-col justify-center gap-2.5">
          <p className="text-gray01 text-base leading-none">{productData?.storeName}</p>
          <p className="overflow-hidden text-lg leading-none font-bold text-ellipsis whitespace-nowrap">
            {productData?.name}
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-130 space-y-10 text-left"
      >
        <Controller
          name="title"
          control={control}
          disabled={isSeller}
          render={({ field }) => (
            <BoxInput
              label="제목"
              checkbox={true}
              isSecret={isSecret}
              placeholder="문의 제목을 입력해주세요"
              onCheckboxChange={(e) => {
                setValue("isSecret", e.target.checked);
              }}
              {...field}
            />
          )}
        />
        {errors.title && <p className="mt-[-2rem] text-red-500">{errors.title.message}</p>}
        <TextArea
          label="문의 내용"
          placeholder="궁금한 내용을 입력해 주세요"
          disabled={isSeller}
          {...register("content")}
        />
        {errors.content && <p className="mt-[-2rem] text-red-500">{errors.content.message}</p>}
        <div className="mt-10 flex gap-5">
          <Button
            label="취소"
            size="large"
            variant="secondary"
            color="white"
            className="h-16.25 w-full"
            onClick={onClose}
          />
          <Button
            type="submit"
            label="문의 등록"
            size="large"
            variant="primary"
            color="black"
            className={`h-16.25 w-full ${isSeller ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isSeller}
          />
        </div>
      </form>
    </Modal>
  );
}
