import { CheckCircle2, XCircle, Users, MapPin, Zap, ArrowRight, Clock } from "lucide-react";
import { Exercise, Screen } from "../types";

interface MachinesScreenProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  currentExercise: Exercise;
  joinedQueues: Set<string>;
  startExercise: (index: number) => void;
  toggleQueue: (exerciseId: string) => void;
  setCurrentScreen: (screen: Screen) => void;
}

export default function MachinesScreen({
  exercises,
  currentExerciseIndex,
  currentExercise,
  joinedQueues,
  startExercise,
  toggleQueue,
  setCurrentScreen,
}: MachinesScreenProps) {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Machines</h1>
        <p className="text-sm opacity-90">Exercise {currentExerciseIndex + 1} of {exercises.length} • {currentExercise.name}</p>
      </div>

      <div className="bg-blue-50 border-b-2 border-blue-200 px-6 py-3">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Next: {currentExercise.name}</p>
            <p className="text-xs text-gray-600">Green = available now • Red = view alternatives</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 pb-24 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(844px - 220px)' }}>
        {exercises.map((exercise, index) => {
          const isNext = index === currentExerciseIndex;

          if (exercise.available && isNext) {
            return (
              <div key={exercise.id} className="p-4 rounded-xl border-2 bg-green-50 border-green-300 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">NEXT</div>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{exercise.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{exercise.zone} - {exercise.station}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-600 text-white inline-block">
                      Available Now
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => startExercise(index)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                >
                  Start Exercise
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          }

          if (!exercise.available) {
            return (
              <div key={exercise.id} className={`p-3 rounded-xl border-2 ${joinedQueues.has(exercise.id) ? 'bg-orange-50 border-orange-400 shadow-md' : 'bg-red-50 border-red-200'}`}>
                {joinedQueues.has(exercise.id) && (
                  <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    YOU'RE IN QUEUE • Position #{exercise.waitingCount}
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{exercise.name}</h3>
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{exercise.zone} - {exercise.station}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Users className="w-3 h-3 text-orange-500" />
                        <span>{exercise.waitingCount} waiting</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-700">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>~{exercise.waitTime} min wait</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-2 mb-2">
                  <p className="text-xs text-blue-700 font-medium">💡 Cable Crossover is available (similar muscle group)</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentScreen("swap")}
                    className="flex-1 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 py-1.5 rounded-lg text-xs font-medium"
                  >
                    View Alternatives
                  </button>
                  <button
                    onClick={() => toggleQueue(exercise.id)}
                    className={`flex-1 border-2 py-1.5 rounded-lg text-xs font-medium ${
                      joinedQueues.has(exercise.id)
                        ? 'border-red-400 text-red-700 hover:bg-red-50 bg-red-100'
                        : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                    }`}
                  >
                    {joinedQueues.has(exercise.id) ? 'Leave Queue' : 'Join Queue'}
                  </button>
                </div>
              </div>
            );
          }

          if (exercise.available && !isNext) {
            return (
              <div key={exercise.id} className="p-2 rounded-lg border bg-white border-gray-200 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-xs">{exercise.name}</h3>
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500">{exercise.zone} - {exercise.station}</p>
                </div>
                <button
                  onClick={() => startExercise(index)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium"
                >
                  Start
                </button>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}
