import { CheckCircle2, Star, TrendingUp } from "lucide-react";
import { Exercise, Screen } from "../types";

interface SwapScreenProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentExercise: Exercise;
  swapExercise: (newExerciseName: string) => void;
  setCurrentScreen: (screen: Screen) => void;
}

export default function SwapScreen({
  exercises,
  currentExerciseIndex,
  currentExercise,
  swapExercise,
  setCurrentScreen,
}: SwapScreenProps) {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Swap Exercise</h1>
        <p className="text-sm opacity-90">Exercise {currentExerciseIndex + 1} of {exercises.length} • {currentExercise.name} unavailable</p>
      </div>

      <div className="bg-amber-50 border-b-2 border-amber-200 px-6 py-3">
        <p className="text-xs text-amber-900">
          <span className="font-semibold">{currentExercise.name} is busy.</span> Here are the best alternatives based on your workout goals.
        </p>
      </div>

      <div className="px-6 pt-4 pb-24 space-y-3 overflow-hidden">
        <div className="bg-white rounded-xl border-2 border-blue-300 p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase">Best Match</span>
            <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
          </div>

          <div className="mb-2">
            <h3 className="font-bold text-gray-900 mb-1">Cable Crossover</h3>
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Available now</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Same muscles</span>
            </div>
            <p className="text-xs text-gray-600">✓ Isolates chest with constant tension</p>
            <p className="text-xs text-gray-600">✓ Great alternative for pec fly movements</p>
          </div>

          <button
            onClick={() => swapExercise("Cable Crossover")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Swap to This Exercise
          </button>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-gray-700">Good Alternative</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>

          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">DB Bench Press</h3>
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Available now</span>
            </div>
            <p className="text-xs text-gray-600">Targets chest, shoulders, triceps</p>
          </div>

          <button
            onClick={() => swapExercise("DB Bench Press")}
            className="w-full bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Swap to This Exercise
          </button>
        </div>

        <button
          onClick={() => setCurrentScreen("workout")}
          className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg text-sm font-medium"
        >
          Skip This Exercise
        </button>
      </div>
    </>
  );
}
