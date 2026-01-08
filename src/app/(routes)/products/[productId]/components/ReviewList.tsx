import Divder from "@/components/divider/Divder";
import formatDate from "@/lib/functions/dateFormat";
import { ReviewData } from "@/types/Review";
import Stars from "./Stars";

interface ReviewListProps {
  data: ReviewData[] | undefined;
}

const ReviewList = ({ data }: ReviewListProps) => {
  // ✅ [수정 여부 판단 함수]
  // 생성 시간(createdAt)과 수정 시간(updatedAt)이 다르면 수정된 것으로 간주
  const isModified = (created: string, updated: string) => {
    // 문자열 날짜를 타임스탬프(숫자)로 변환하여 비교
    // (네트워크 딜레이 등으로 1초 미만 차이가 날 수도 있으니 확실하게 크면 수정됨 처리)
    return new Date(updated).getTime() > new Date(created).getTime();
  };

  return (
    <div className="my-15">
      {data?.map((review) => (
        <div key={review.id}>
          <p className="text-black02 mb-2.5 text-lg">
            {review.user.name} <span className="text-gray01">| {formatDate(review.createdAt)}</span>
          </p>
          <Stars
            rating={review.rating}
            size="medium"
          />

          {/* ✅ 내용 및 (수정됨) 표시 영역 */}
          <p className="my-7.5">
            {review.content}

            {/* 1. updatedAt이 존재하고 */}
            {/* 2. createdAt과 시간이 다르면 -> (수정됨) 표시 */}
            {review.updatedAt && isModified(review.createdAt, review.updatedAt) && (
              <span className="ml-2 text-xs font-normal text-gray-400">(수정됨)</span>
            )}
          </p>

          <Divder className="my-7.5" />
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
