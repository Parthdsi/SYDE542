import { CheckCircle, Clock, Plus, Minus, Lightbulb, Flame } from "lucide-react";
import { Exercise, Screen } from "../types";

interface LiveScreenProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentExercise: Exercise;
  currentSet: number;
  currentReps: number;
  setCurrentReps: (reps: number) => void;
  completeSet: () => void;
  setIsTracking: (tracking: boolean) => void;
  setCurrentScreen: (screen: Screen) => void;
  startExercise: (index: number) => void;
}

export default function LiveScreen({
  exercises,
  currentExerciseIndex,
  currentExercise,
  currentSet,
  currentReps,
  setCurrentReps,
  completeSet,
  setIsTracking,
  setCurrentScreen,
  startExercise,
}: LiveScreenProps) {
  const isOverTarget = currentReps > currentExercise.reps;
  const isAtTarget = currentReps === currentExercise.reps;
  const hasTracking = currentSet > 0 && currentExercise.setsCompleted < currentExercise.sets;

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{currentExercise.name}</h1>
            <p className="text-sm opacity-90">Set {currentSet} of {currentExercise.sets} • Exercise {currentExerciseIndex + 1} of {exercises.length}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium hover:bg-white/20 rounded-lg transition-colors">
              Form Tips
            </button>
            <button
              onClick={() => {
                setIsTracking(false);
                setCurrentScreen("workout");
              }}
              className="px-3 py-1.5 text-sm font-medium hover:bg-white/20 rounded-lg transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-90">{currentExercise.weight} lbs</span>
          <span className="text-xs opacity-75">• Target: {currentExercise.reps} reps</span>
        </div>
      </div>

      <div className="px-6 pb-24 overflow-y-auto" style={{ maxHeight: 'calc(100% - 200px)' }}>
        {!hasTracking ? (
          /* No active tracking — show a start prompt */
          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">No active tracking session.</p>
            <button
              onClick={() => startExercise(currentExerciseIndex)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              Start Tracking
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-600 font-medium">Auto-counting active</p>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Current Reps</p>
              <div className={`text-9xl font-black mb-4 transition-colors ${isOverTarget ? 'text-amber-500' : 'text-blue-600'}`}>
                {currentReps}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                {isOverTarget ? (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-bold text-amber-600">Going beyond! 🔥</span>
                    </div>
                    <p className="text-xs text-amber-700">Wow, you're gonna keep going? You're really on the money!</p>
                  </div>
                ) : isAtTarget ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Target reached! ✓</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">{currentExercise.reps - currentReps} reps to go</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Minus className="w-5 h-5" />
                <span className="text-sm font-medium">Remove Rep</span>
              </button>
              <button
                onClick={() => setCurrentReps(currentReps + 1)}
                className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add Rep</span>
              </button>
            </div>

            <button
              onClick={completeSet}
              className={`w-full h-14 rounded-lg text-base font-semibold mb-3 flex items-center justify-center gap-2 transition-colors ${
                currentReps >= currentExercise.reps
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={currentReps < currentExercise.reps}
            >
              <CheckCircle className="w-5 h-5" />
              Complete Set {currentSet}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-semibold text-gray-900">
                  {currentSet < currentExercise.sets ? `Next: 60s rest` : 'Last set — finish strong!'}
                </p>
              </div>
              <p className="text-xs text-gray-600">
                {currentSet < currentExercise.sets ? `Then Set ${currentSet + 1} of ${currentExercise.sets}` : 'Great job!'}
              </p>
            </div>

            <button
              onClick={() => {
                setIsTracking(false);
                setCurrentScreen("workout");
              }}
              className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium py-2 transition-colors"
            >
              Cancel & Exit
            </button>
          </div>
        )}

        <button className="mt-6 w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-left hover:bg-white/15 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <h3 className="font-semibold text-sm">View Form Tips</h3>
            </div>
            <span className="text-xs opacity-75">Tap to view</span>
          </div>
        </button>

        <button
          onClick={() => {
            setIsTracking(false);
            setCurrentScreen("workout");
          }}
          className="mt-3 w-full text-white/80 hover:text-white text-sm font-medium py-2 text-center transition-colors"
        >
          ← Back to Workout
        </button>
      </div>
    </>
  );
}
