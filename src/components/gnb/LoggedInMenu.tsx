import { postLogout } from "@/lib/api/auth";
import { useToaster } from "@/proviers/toaster/toaster.hook";
import { useUserStore } from "@/stores/userStore";
import { User } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Profile from "./Profile";

interface LoggedInMenuProps {
  user: User;
}

export default function LoggedInMenu({ user }: LoggedInMenuProps) {
  const { logout } = useUserStore();
  const router = useRouter();
  const toaster = useToaster();

  const logoutMutation = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      logout();
      toaster("info", "성공적으로 로그아웃되었습니다.");
    },
    onError: (error: unknown) => {
      let message = "로그아웃에 실패했습니다.";

      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        message = data?.errorMessage || data?.message || message;

        if (error.response?.status === 401 && !data?.message) {
          message = "인증이 만료되었습니다. 다시 로그인해주세요.";
        }
      }

      toaster("warn", message);
      logout();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCartClick = () => {
    if (user?.type === "BUYER") {
      router.push("/buyer/shopping");
    }
  };

  return (
    <div className="flex gap-[50px]">
      <Profile
        name={user.name}
        image={user.image}
        role={user.type}
      />
      <button
        className="text-gray01 px-[10.5px] py-[10px] text-sm"
        onClick={handleLogout}
      >
        로그아웃
      </button>
      {user?.type === "BUYER" && (
        <button
          onClick={handleCartClick}
          className="cursor-pointer"
        >
          <Image
            src="/icon/incart.svg"
            alt="장바구니"
            width={20}
            height={20}
          />
        </button>
      )}
    </div>
  );
}
