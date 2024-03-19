import { ModeToggle } from "@/components/mode-toggle";
import LoginForm from "./login-form";
// import { useTranslation } from "react-i18next";

export default function LoginPage() {
  // const { t } = useTranslation();
  return (
    <div>
      <ModeToggle />
      <h1 className="text-xl font-semibold text-center">Login</h1>
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
