import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <div className="w-full h-[60px] bg-black flex items-center justify-between px-10">
      <div className="font-bold text-white">FRONTEND EXAM</div>
      <ModeToggle />
    </div>
  );
}
