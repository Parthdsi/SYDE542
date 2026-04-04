import { Zap, Play, CheckCircle, Clock, Plus, Minus, ArrowLeftRight, Trophy, Flame } from "lucide-react";
import { Exercise, Screen } from "../types";

interface WorkoutScreenProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentExercise: Exercise;
  progressPercentage: number;
  completedSets: number;
  totalSets: number;
  editingExerciseId: string | null;
  editForm: { sets: number; reps: number; weight: number };
  isLiveTracking: boolean;
  currentSet: number;
  currentReps: number;
  workoutComplete: boolean;
  startExercise: (index: number) => void;
  startEditExercise: (exercise: Exercise) => void;
  saveExerciseEdit: () => void;
  cancelExerciseEdit: () => void;
  setEditForm: (form: { sets: number; reps: number; weight: number }) => void;
  setCurrentReps: (reps: number) => void;
  completeSet: () => void;
  stopTracking: () => void;
  setCurrentScreen: (screen: Screen) => void;
  openSwapScreen: (index: number) => void;
}

export default function WorkoutScreen({
  exercises,
  currentExerciseIndex,
  currentExercise,
  progressPercentage,
  completedSets,
  totalSets,
  editingExerciseId,
  editForm,
  isLiveTracking,
  currentSet,
  currentReps,
  workoutComplete,
  startExercise,
  startEditExercise,
  saveExerciseEdit,
  cancelExerciseEdit,
  setEditForm,
  setCurrentReps,
  completeSet,
  stopTracking,
  setCurrentScreen,
  openSwapScreen,
}: WorkoutScreenProps) {
  const isOverTarget = currentReps > currentExercise.reps;
  const isAtTarget = currentReps === currentExercise.reps;
  const exerciseFullyDone = currentExercise.setsCompleted >= currentExercise.sets;

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-1">Today's Workout</h1>
        <p className="text-sm opacity-90">Chest & Triceps</p>
      </div>

      <div className="px-6 pt-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 140px)', paddingBottom: '80px' }}>
        
        {/* WORKOUT COMPLETE CELEBRATION */}
        {workoutComplete && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 mb-4 text-white shadow-lg text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-1">Workout Complete! 🎉</h2>
            <p className="text-sm opacity-90">Amazing job! You crushed every exercise today.</p>
            <p className="text-xs opacity-75 mt-2">{totalSets} sets completed</p>
          </div>
        )}

        {/* NEXT EXERCISE CARD - only show if workout isn't complete */}
        {!workoutComplete && !isLiveTracking && (
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 mb-4 text-white shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">
                    {currentExercise.setsCompleted > 0 ? 'Continue Exercise' : 'Next Exercise'}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{currentExercise.name}</h3>
                <p className="text-sm opacity-90">{currentExercise.weight} lbs • {currentExercise.sets} sets × {currentExercise.reps} reps</p>
                <p className="text-xs opacity-75 mt-1">{currentExercise.station}, {currentExercise.zone}</p>
                {currentExercise.setsCompleted > 0 && (
                  <p className="text-xs mt-1 font-semibold bg-white/20 inline-block px-2 py-0.5 rounded-full">
                    {currentExercise.setsCompleted}/{currentExercise.sets} sets done
                  </p>
                )}
              </div>
            </div>
            {currentExercise.available ? (
              <button
                onClick={() => startExercise(currentExerciseIndex)}
                className="w-full bg-white hover:bg-gray-100 text-green-700 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                {currentExercise.setsCompleted > 0 ? 'Continue This Exercise' : 'Start This Exercise'}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => openSwapScreen(currentExerciseIndex)}
                  className="flex-1 bg-white hover:bg-gray-100 text-amber-600 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Swap Exercise
                </button>
              </div>
            )}
          </div>
        )}

        {/* INLINE LIVE TRACKING PANEL */}
        {isLiveTracking && (
          <div className="bg-white rounded-2xl border-2 border-blue-400 p-4 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-green-600 uppercase">Live Tracking</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{currentExercise.name}</h3>
                <p className="text-xs text-gray-500">Set {currentSet} of {currentExercise.sets} • {currentExercise.weight} lbs</p>
              </div>
              <button
                onClick={stopTracking}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
              >
                Stop
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="text-xs text-gray-500 mb-1">Current Reps</p>
              <div className={`text-7xl font-black mb-2 transition-colors ${isOverTarget ? 'text-amber-500' : 'text-blue-600'}`}>
                {currentReps}
              </div>
              <div className="flex items-center justify-center gap-2">
                {isOverTarget ? (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-amber-600">Going beyond! 🔥</span>
                    </div>
                    <p className="text-xs text-amber-700">Wow, you're gonna keep going? You're really on the money!</p>
                  </div>
                ) : isAtTarget ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">Target reached! ✓</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">{currentExercise.reps - currentReps} reps to go</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-colors"
              >
                <Minus className="w-4 h-4" />
                Remove Rep
              </button>
              <button
                onClick={() => setCurrentReps(currentReps + 1)}
                className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Rep
              </button>
            </div>

            <button
              onClick={completeSet}
              className={`w-full h-12 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                currentReps >= currentExercise.reps
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={currentReps < currentExercise.reps}
            >
              <CheckCircle className="w-5 h-5" />
              Complete Set {currentSet}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-3">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <p className="text-xs text-gray-600">
                  {currentSet < currentExercise.sets ? `Next: 60s rest → Set ${currentSet + 1}` : 'Last set — finish strong!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS BAR */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900 text-sm">Workout Progress</p>
            <p className="text-sm font-bold text-blue-600">{progressPercentage}%</p>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{completedSets} of {totalSets} sets completed</span>
            <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
          </div>
        </div>

        {/* ALL EXERCISES HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">All Exercises</h2>
        </div>

        {/* EXERCISE LIST */}
        <div className="space-y-2 pb-4">
          {exercises.map((exercise, index) => {
            const isActive = index === currentExerciseIndex && exercise.setsCompleted > 0 && exercise.setsCompleted < exercise.sets;
            const isStarted = exercise.setsCompleted > 0;
            const isDone = exercise.setsCompleted >= exercise.sets;
            const isEditing = editingExerciseId === exercise.id;

            if (isEditing) {
              return (
                <div key={exercise.id} className="p-3 rounded-xl border-2 bg-blue-50 border-blue-400 shadow-md">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Editing: {exercise.name}</h3>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Weight (lbs)</label>
                        <input
                          type="number"
                          value={editForm.weight}
                          onChange={(e) => setEditForm({ ...editForm, weight: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Sets</label>
                        <input
                          type="number"
                          value={editForm.sets}
                          onChange={(e) => setEditForm({ ...editForm, sets: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Reps</label>
                        <input
                          type="number"
                          value={editForm.reps}
                          onChange={(e) => setEditForm({ ...editForm, reps: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-center"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={saveExerciseEdit}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={cancelExerciseEdit}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            if (isActive) {
              return (
                <div key={exercise.id} className="p-3 rounded-xl border-2 bg-blue-50 border-blue-300">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{exercise.name}</h3>
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">IN PROGRESS</span>
                      </div>
                      <p className="text-xs text-gray-600">{exercise.weight} lbs • {exercise.sets} × {exercise.reps}</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <button
                        onClick={() => startEditExercise(exercise)}
                        className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-200 rounded border border-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">{exercise.setsCompleted}/{exercise.sets}</div>
                        <p className="text-xs text-gray-500">Sets</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => startExercise(index)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Continue This Exercise
                  </button>
                </div>
              );
            }

            return (
              <div key={exercise.id} className={`p-2.5 rounded-lg border transition-colors ${
                isDone ? 'bg-green-50/50 border-green-200' :
                !exercise.available ? 'bg-red-50/50 border-red-200' :
                isStarted ? 'bg-blue-50/50 border-blue-200' :
                'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`font-semibold text-sm ${isDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{exercise.name}</h3>
                      {isDone && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Done ✓</span>
                      )}
                      {!exercise.available && !isDone && (
                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">Unavailable</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{exercise.weight} lbs • {exercise.sets} × {exercise.reps}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isDone && (
                      <button
                        onClick={() => startEditExercise(exercise)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    <div className="text-right mr-1">
                      <div className={`text-lg font-bold ${isDone ? 'text-green-600' : isStarted ? 'text-blue-600' : 'text-gray-400'}`}>
                        {exercise.setsCompleted}/{exercise.sets}
                      </div>
                    </div>
                    {isDone ? (
                      <div className="w-16 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </div>
                    ) : !exercise.available ? (
                      <button
                        onClick={() => openSwapScreen(index)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        Swap
                      </button>
                    ) : (
                      <button
                        onClick={() => startExercise(index)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        {isStarted ? 'Continue' : 'Start'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
