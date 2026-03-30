import { Zap, Play, Pencil, Edit3 } from "lucide-react";
import { Exercise } from "../types";

interface WorkoutScreenProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentExercise: Exercise;
  progressPercentage: number;
  completedSets: number;
  totalSets: number;
  editingExerciseId: string | null;
  editForm: { sets: number; reps: number; weight: number };
  startExercise: (index: number) => void;
  startEditExercise: (exercise: Exercise) => void;
  saveExerciseEdit: () => void;
  cancelExerciseEdit: () => void;
  setEditForm: (form: { sets: number; reps: number; weight: number }) => void;
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
  startExercise,
  startEditExercise,
  saveExerciseEdit,
  cancelExerciseEdit,
  setEditForm,
}: WorkoutScreenProps) {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-1">Today's Workout</h1>
        <p className="text-sm opacity-90">Chest & Triceps</p>
      </div>

      <div className="px-6 pt-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 mb-4 text-white shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Next Exercise</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{currentExercise.name}</h3>
              <p className="text-sm opacity-90">{currentExercise.weight} lbs • {currentExercise.sets} sets × {currentExercise.reps} reps</p>
              <p className="text-xs opacity-75 mt-1">{currentExercise.station}, {currentExercise.zone}</p>
            </div>
          </div>
          <button
            onClick={() => startExercise(currentExerciseIndex)}
            className="w-full bg-white hover:bg-gray-100 text-green-700 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start This Exercise
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-900 text-sm">Workout Progress</p>
            <p className="text-sm font-bold text-blue-600">{progressPercentage}%</p>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-600" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{completedSets} of {totalSets} sets completed</span>
            <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">All Exercises</h2>
          <button className="text-blue-600 text-xs font-medium hover:underline flex items-center gap-1">
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>

      <div className="px-6 pb-24 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(844px - 450px)' }}>
        {exercises.map((exercise, index) => {
          const isActive = index === currentExerciseIndex && exercise.setsCompleted > 0 && exercise.setsCompleted < exercise.sets;
          const isStarted = exercise.setsCompleted > 0;
          const isEditing = editingExerciseId === exercise.id;

          if (isEditing) {
            return (
              <div key={exercise.id} className="p-3 rounded-xl border-2 bg-blue-50 border-blue-400 shadow-md">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{exercise.name}</h3>

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
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-semibold"
                    >
                      ✓ Save Changes
                    </button>
                    <button
                      onClick={cancelExerciseEdit}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-xs font-semibold"
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
                      className="p-1 hover:bg-blue-200 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">{exercise.setsCompleted}/{exercise.sets}</div>
                      <p className="text-xs text-gray-500">Sets</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => startExercise(index)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-semibold"
                >
                  Continue This Exercise
                </button>
              </div>
            );
          }

          return (
            <div key={exercise.id} className={`p-2.5 rounded-lg border ${isStarted ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{exercise.name}</h3>
                  <p className="text-xs text-gray-600">{exercise.weight} lbs • {exercise.sets} × {exercise.reps}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditExercise(exercise)}
                    className="p-1.5 hover:bg-gray-200 rounded"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <div className="text-right mr-2">
                    <div className={`text-lg font-bold ${isStarted ? 'text-blue-600' : 'text-gray-400'}`}>
                      {exercise.setsCompleted}/{exercise.sets}
                    </div>
                  </div>
                  <button
                    onClick={() => startExercise(index)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium"
                  >
                    {isStarted ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
