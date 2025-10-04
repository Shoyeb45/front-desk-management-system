import { Login } from "@/components/login";
import { decodeToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  

  return (
    <div className="">
      <Login />
    </div>
  );
}
