import Image from "next/image";
import Link from "next/link";
import StockAlertPopover from "./StockAlertPopover";

interface ProfileProps {
  name: string;
  image: string | null;
  role: "BUYER" | "SELLER";
}

// ✅ 기본 이미지 주소 (S3에 올려둔 기본 이미지 URL)
const DEFAULT_PROFILE_IMAGE = "https://codiit-team1-images.s3.ap-northeast-2.amazonaws.com/upload/default-profile.png";

export default function Profile({ name, image, role }: ProfileProps) {
  const roleText = role === "BUYER" ? "바이어" : "셀러";
  const href = role === "BUYER" ? "/buyer/mypage" : "/seller/stores";

  // ✅ 안전장치: 이미지가 없거나 빈 문자열이면 기본 이미지 사용
  const profileImage = image && image.trim() !== "" ? image : DEFAULT_PROFILE_IMAGE;

  return (
    <div className="flex items-center gap-5">
      <StockAlertPopover />
      <div className="bg-gray03 h-3 w-[1px]" />
      <Link
        href={href}
        className="flex cursor-pointer items-center gap-[10px]"
      >
        <Image
          className="h-10 w-10 rounded-full object-cover" // object-cover 추가 추천
          src={profileImage} // 👈 여기를 수정된 변수로 변경
          alt="프로필 이미지"
          width={40}
          height={40}
        />
        <div className="text-black02 text-sm font-bold">{name}</div>
      </Link>
      <div className="bg-gray03 h-3 w-[1px]" />
      <div className="text-black02 text-sm">{roleText}</div>
    </div>
  );
}
