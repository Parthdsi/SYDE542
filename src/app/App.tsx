import { useState } from "react";
import { CheckCircle2, XCircle, Users, MapPin, Dumbbell, BarChart3, Activity, HelpCircle, ArrowLeftRight, Clock, Zap, ArrowRight, Pencil, Edit3, Play, Star, TrendingUp, Plus, Minus, Lightbulb, CheckCircle, X } from "lucide-react";

type Screen = "machines" | "workout" | "swap" | "live" | "help";

interface Exercise {
  id: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
  setsCompleted: number;
  station: string;
  zone: string;
  available: boolean;
  waitingCount?: number;
  waitTime?: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("workout");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [joinedQueues, setJoinedQueues] = useState<Set<string>>(new Set());
  const [queueNotification, setQueueNotification] = useState<{ message: string; show: boolean }>({ message: "", show: false });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ sets: number; reps: number; weight: number }>({ sets: 0, reps: 0, weight: 0 });

  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "Chest Press", weight: 185, sets: 3, reps: 10, setsCompleted: 0, station: "Station 12", zone: "Zone A", available: true },
    { id: "2", name: "Pectoral Fly", weight: 55, sets: 3, reps: 12, setsCompleted: 0, station: "Station 14", zone: "Zone A", available: false, waitingCount: 3, waitTime: 12 },
    { id: "3", name: "Cable Crossover", weight: 50, sets: 3, reps: 12, setsCompleted: 0, station: "Station 16", zone: "Zone A", available: true },
    { id: "4", name: "Tricep Pushdown", weight: 70, sets: 3, reps: 12, setsCompleted: 0, station: "Station 8", zone: "Zone B", available: true },
    { id: "5", name: "Overhead Extension", weight: 45, sets: 3, reps: 10, setsCompleted: 0, station: "Station 10", zone: "Zone B", available: true },
  ]);

  const currentExercise = exercises[currentExerciseIndex];
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = exercises.reduce((acc, ex) => acc + ex.setsCompleted, 0);
  const progressPercentage = Math.round((completedSets / totalSets) * 100);

  const startExercise = (index: number) => {
    setCurrentExerciseIndex(index);
    setCurrentScreen("live");
    setIsTracking(true);
    setCurrentSet(exercises[index].setsCompleted + 1);
    setCurrentReps(0);
  };

  const completeSet = () => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].setsCompleted += 1;
    setExercises(updatedExercises);

    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      setCurrentReps(0);
    } else {
      // Move to next exercise
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setCurrentReps(0);
      }
      setIsTracking(false);
      setCurrentScreen("workout");
    }
  };

  const swapExercise = (newExerciseName: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].name = newExerciseName;
    updatedExercises[currentExerciseIndex].available = true;
    setExercises(updatedExercises);
    setCurrentScreen("workout");
  };

  const toggleQueue = (exerciseId: string) => {
    const newQueues = new Set(joinedQueues);
    const updatedExercises = [...exercises];
    const exerciseIndex = updatedExercises.findIndex(ex => ex.id === exerciseId);
    const isJoining = !newQueues.has(exerciseId);
    
    if (newQueues.has(exerciseId)) {
      // Leave queue
      newQueues.delete(exerciseId);
      if (updatedExercises[exerciseIndex].waitingCount) {
        updatedExercises[exerciseIndex].waitingCount! -= 1;
      }
    } else {
      // Join queue
      newQueues.add(exerciseId);
      updatedExercises[exerciseIndex].waitingCount = (updatedExercises[exerciseIndex].waitingCount || 0) + 1;
    }
    
    setJoinedQueues(newQueues);
    setExercises(updatedExercises);
    
    // Show notification
    setQueueNotification({ 
      message: isJoining 
        ? `✓ You joined the queue for ${updatedExercises[exerciseIndex].name}. We'll notify you when it's ready!` 
        : `You left the queue for ${updatedExercises[exerciseIndex].name}.`, 
      show: true 
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setQueueNotification({ message: "", show: false });
    }, 3000);
  };

  const startEditExercise = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    setEditForm({
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight
    });
  };

  const saveExerciseEdit = () => {
    if (editingExerciseId) {
      const updatedExercises = exercises.map(ex => 
        ex.id === editingExerciseId 
          ? { ...ex, sets: editForm.sets, reps: editForm.reps, weight: editForm.weight }
          : ex
      );
      setExercises(updatedExercises);
      setEditingExerciseId(null);
    }
  };

  const cancelExerciseEdit = () => {
    setEditingExerciseId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:p-8 w-full">
      <div className="shadow-2xl sm:rounded-[2rem] overflow-hidden w-full max-w-md bg-white">
        <div className="w-full h-[100dvh] sm:h-[844px] bg-white overflow-hidden relative">
          
          {/* NOTIFICATION BANNER */}
          {queueNotification.show && (
            <div className="absolute top-0 left-0 right-0 z-50 animate-slide-down">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 shadow-lg">
                <p className="text-sm font-medium text-center">{queueNotification.message}</p>
              </div>
            </div>
          )}
          
          {/* MACHINES SCREEN */}
          {currentScreen === "machines" && (
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
          )}

          {/* WORKOUT SCREEN */}
          {currentScreen === "workout" && (
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
          )}

          {/* SWAP SCREEN */}
          {currentScreen === "swap" && (
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
                    <h3 className="font-bold text-gray-900 mb-1">DB Bench Press</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Available now</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Same muscles</span>
                    </div>
                    <p className="text-xs text-gray-600">✓ Targets chest, shoulders, triceps</p>
                    <p className="text-xs text-gray-600">✓ Great for muscle balance</p>
                  </div>

                  <button 
                    onClick={() => swapExercise("DB Bench Press")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold"
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
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Cable Crossover</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Available now</span>
                    </div>
                    <p className="text-xs text-gray-600">Different angle, constant tension on chest</p>
                  </div>

                  <button 
                    onClick={() => swapExercise("Cable Crossover")}
                    className="w-full bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 py-1.5 rounded-lg text-sm font-medium"
                  >
                    Swap to This Exercise
                  </button>
                </div>

                <div className="bg-white rounded-xl border-2 border-gray-200 p-3 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Also Works</span>
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>

                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Pectoral Fly</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">In use - 3 waiting</span>
                    </div>
                    <p className="text-xs text-gray-600">Isolates chest muscles</p>
                  </div>

                  <button className="w-full bg-gray-200 text-gray-500 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed">
                    Currently Unavailable
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
          )}

          {/* LIVE TRACKING SCREEN */}
          {currentScreen === "live" && (
            <>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{currentExercise.name}</h1>
                    <p className="text-sm opacity-90">Set {currentSet} of {currentExercise.sets} • Exercise {currentExerciseIndex + 1} of {exercises.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                      <Lightbulb className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setIsTracking(false);
                        setCurrentScreen("workout");
                      }}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-90">{currentExercise.weight} lbs</span>
                  <span className="text-xs opacity-75">• Target: {currentExercise.reps} reps</span>
                </div>
              </div>

              <div className="px-6 pb-24">
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-600 font-medium">Auto-counting active</p>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-2">Current Reps</p>
                    <div className="text-9xl font-black text-blue-600 mb-4">{currentReps}</div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      {currentReps >= currentExercise.reps ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">Target reached!</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">{currentExercise.reps - currentReps} reps to go</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button 
                      onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                      className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center"
                    >
                      <Minus className="w-5 h-5" />
                      <span className="text-xs ml-1">Adjust</span>
                    </button>
                    <button 
                      onClick={() => setCurrentReps(currentReps + 1)}
                      className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-xs ml-1">Adjust</span>
                    </button>
                  </div>

                  <button 
                    onClick={completeSet}
                    className={`w-full h-14 rounded-lg text-base font-semibold mb-3 flex items-center justify-center gap-2 ${
                      currentReps >= currentExercise.reps
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={currentReps < currentExercise.reps}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Set
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <p className="text-xs font-semibold text-gray-900">
                        {currentSet < currentExercise.sets ? `Next: 60s rest` : 'Workout complete!'}
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
                    className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
                  >
                    Cancel & Exit
                  </button>
                </div>

                <button className="mt-6 w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-left hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">View Form Tips</h3>
                    </div>
                    <span className="text-xs opacity-75">Tap to view</span>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* HELP SCREEN */}
          {currentScreen === "help" && (
            <>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
                <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
                <p className="text-sm opacity-90">Get assistance with your workout</p>
              </div>

              <div className="px-6 pt-6 pb-24">
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Quick Guide</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• <strong>Workout:</strong> View and start your exercises</li>
                      <li>• <strong>Machines:</strong> Check machine availability</li>
                      <li>• <strong>Swap:</strong> Find alternative exercises</li>
                      <li>• <strong>Live:</strong> Track your reps in real-time</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Need Assistance?</h3>
                    <p className="text-sm text-gray-600 mb-3">Contact gym staff for help with equipment or exercises.</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold">
                      Call Gym Staff
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">How does auto-counting work?</p>
                        <p className="text-gray-600">Our AI tracks your movements in real-time and counts reps automatically.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Can I modify my workout?</p>
                        <p className="text-gray-600">Yes! Use the Swap feature to find alternative exercises anytime.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* BOTTOM NAVIGATION */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-around">
              <button 
                onClick={() => setCurrentScreen("machines")}
                className={`flex flex-col items-center gap-1 ${currentScreen === "machines" ? "text-blue-600" : "text-gray-500"}`}
              >
                <Dumbbell className="w-5 h-5" />
                <span className={`text-xs ${currentScreen === "machines" ? "font-semibold" : ""}`}>Machines</span>
              </button>
              <button 
                onClick={() => setCurrentScreen("workout")}
                className={`flex flex-col items-center gap-1 ${currentScreen === "workout" ? "text-blue-600" : "text-gray-500"}`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className={`text-xs ${currentScreen === "workout" ? "font-semibold" : ""}`}>Workout</span>
              </button>
              <button 
                onClick={() => setCurrentScreen("swap")}
                className={`flex flex-col items-center gap-1 ${currentScreen === "swap" ? "text-blue-600" : "text-gray-500"}`}
              >
                <ArrowLeftRight className="w-5 h-5" />
                <span className={`text-xs ${currentScreen === "swap" ? "font-semibold" : ""}`}>Swap</span>
              </button>
              <button 
                onClick={() => setCurrentScreen("live")}
                className={`flex flex-col items-center gap-1 ${currentScreen === "live" ? "text-blue-600" : "text-gray-500"}`}
              >
                <Activity className="w-5 h-5" />
                <span className={`text-xs ${currentScreen === "live" ? "font-semibold" : ""}`}>Live</span>
              </button>
              <button 
                onClick={() => setCurrentScreen("help")}
                className={`flex flex-col items-center gap-1 ${currentScreen === "help" ? "text-blue-600" : "text-gray-500"}`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className={`text-xs ${currentScreen === "help" ? "font-semibold" : ""}`}>Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}