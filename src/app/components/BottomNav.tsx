import { Dumbbell, BarChart3, ArrowLeftRight, Activity, HelpCircle } from "lucide-react";
import { Screen } from "../types";

interface BottomNavProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, setCurrentScreen }: BottomNavProps) {
  const tabs: { screen: Screen; icon: typeof Dumbbell; label: string }[] = [
    { screen: "machines", icon: Dumbbell, label: "Machines" },
    { screen: "workout", icon: BarChart3, label: "Workout" },
    { screen: "swap", icon: ArrowLeftRight, label: "Swap" },
    { screen: "live", icon: Activity, label: "Live" },
    { screen: "help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-around">
        {tabs.map(({ screen, icon: Icon, label }) => (
          <button
            key={screen}
            onClick={() => setCurrentScreen(screen)}
            className={`flex flex-col items-center gap-1 ${currentScreen === screen ? "text-blue-600" : "text-gray-500"}`}
          >
            <Icon className="w-5 h-5" />
            <span className={`text-xs ${currentScreen === screen ? "font-semibold" : ""}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
