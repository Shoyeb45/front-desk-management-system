import { Login } from "@/components/auth/login";
import { WakeUpServer } from "@/components/WakeUpServerComponent";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex">
      <WakeUpServer />
      <Login />
    </div>
  );
}