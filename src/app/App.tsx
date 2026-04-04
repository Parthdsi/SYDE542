import { useState } from "react";
import { Screen, Exercise } from "./types";
import BottomNav from "./components/BottomNav";
import MachinesScreen from "./pages/MachinesScreen";
import WorkoutScreen from "./pages/WorkoutScreen";
import SwapScreen from "./pages/SwapScreen";
import LiveScreen from "./pages/LiveScreen";
import HelpScreen from "./pages/HelpScreen";

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
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [workoutComplete, setWorkoutComplete] = useState(false);

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
  const progressPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Find next incomplete exercise index
  const findNextIncompleteExercise = (): number => {
    for (let i = 0; i < exercises.length; i++) {
      if (exercises[i].setsCompleted < exercises[i].sets) {
        return i;
      }
    }
    return exercises.length - 1;
  };

  const startExercise = (index: number) => {
    setCurrentExerciseIndex(index);
    setIsTracking(true);
    setCurrentSet(exercises[index].setsCompleted + 1);
    setCurrentReps(0);
    // Stay on workout screen — live tracking is inline
    if (currentScreen !== "workout") {
      setCurrentScreen("workout");
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const completeSet = () => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].setsCompleted += 1;
    setExercises(updatedExercises);

    if (currentSet < currentExercise.sets) {
      // More sets remain for this exercise
      setCurrentSet(currentSet + 1);
      setCurrentReps(0);
    } else {
      // Exercise complete - find next incomplete exercise
      setIsTracking(false);
      const nextIndex = findNextIncompleteExerciseAfterUpdate(updatedExercises);
      if (nextIndex !== -1) {
        setCurrentExerciseIndex(nextIndex);
      } else {
        // All exercises done!
        setWorkoutComplete(true);
      }
    }
  };

  const findNextIncompleteExerciseAfterUpdate = (exs: Exercise[]): number => {
    for (let i = 0; i < exs.length; i++) {
      if (exs[i].setsCompleted < exs[i].sets) {
        return i;
      }
    }
    return -1;
  };

  const openSwapScreen = (index: number) => {
    setSwapTargetIndex(index);
    setCurrentScreen("swap");
  };

  // When navigating via bottom nav, auto-target the first unavailable exercise for swap
  const handleScreenChange = (screen: Screen) => {
    if (screen === "swap") {
      const firstUnavailableIndex = exercises.findIndex(ex => !ex.available);
      if (firstUnavailableIndex !== -1) {
        setSwapTargetIndex(firstUnavailableIndex);
      }
    }
    setCurrentScreen(screen);
  };

  const swapExercise = (newExerciseName: string) => {
    const targetIndex = swapTargetIndex !== null ? swapTargetIndex : currentExerciseIndex;
    const updatedExercises = [...exercises];
    updatedExercises[targetIndex].name = newExerciseName;
    updatedExercises[targetIndex].available = true;
    setExercises(updatedExercises);
    setSwapTargetIndex(null);
    setCurrentScreen("workout");
  };

  const toggleQueue = (exerciseId: string) => {
    const newQueues = new Set(joinedQueues);
    const updatedExercises = [...exercises];
    const exerciseIndex = updatedExercises.findIndex(ex => ex.id === exerciseId);
    const isJoining = !newQueues.has(exerciseId);

    if (newQueues.has(exerciseId)) {
      newQueues.delete(exerciseId);
      if (updatedExercises[exerciseIndex].waitingCount) {
        updatedExercises[exerciseIndex].waitingCount! -= 1;
      }
    } else {
      newQueues.add(exerciseId);
      updatedExercises[exerciseIndex].waitingCount = (updatedExercises[exerciseIndex].waitingCount || 0) + 1;
    }

    setJoinedQueues(newQueues);
    setExercises(updatedExercises);

    setQueueNotification({
      message: isJoining
        ? `✓ You joined the queue for ${updatedExercises[exerciseIndex].name}. We'll notify you when it's ready!`
        : `You left the queue for ${updatedExercises[exerciseIndex].name}.`,
      show: true
    });

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

  // Get the exercise to swap (for SwapScreen context)
  const swapTargetExercise = swapTargetIndex !== null ? exercises[swapTargetIndex] : currentExercise;

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

          {currentScreen === "machines" && (
            <MachinesScreen
              exercises={exercises}
              currentExerciseIndex={currentExerciseIndex}
              currentExercise={currentExercise}
              joinedQueues={joinedQueues}
              startExercise={startExercise}
              toggleQueue={toggleQueue}
              setCurrentScreen={setCurrentScreen}
              openSwapScreen={openSwapScreen}
            />
          )}

          {currentScreen === "workout" && (
            <WorkoutScreen
              exercises={exercises}
              currentExerciseIndex={currentExerciseIndex}
              currentExercise={currentExercise}
              progressPercentage={progressPercentage}
              completedSets={completedSets}
              totalSets={totalSets}
              editingExerciseId={editingExerciseId}
              editForm={editForm}
              isLiveTracking={isTracking}
              currentSet={currentSet}
              currentReps={currentReps}
              workoutComplete={workoutComplete}
              startExercise={startExercise}
              startEditExercise={startEditExercise}
              saveExerciseEdit={saveExerciseEdit}
              cancelExerciseEdit={cancelExerciseEdit}
              setEditForm={setEditForm}
              setCurrentReps={setCurrentReps}
              completeSet={completeSet}
              stopTracking={stopTracking}
              setCurrentScreen={setCurrentScreen}
              openSwapScreen={openSwapScreen}
            />
          )}

          {currentScreen === "swap" && (
            <SwapScreen
              exercises={exercises}
              currentExerciseIndex={swapTargetIndex !== null ? swapTargetIndex : currentExerciseIndex}
              currentExercise={swapTargetExercise}
              swapExercise={swapExercise}
              setCurrentScreen={setCurrentScreen}
            />
          )}

          {currentScreen === "live" && (
            <LiveScreen
              exercises={exercises}
              currentExerciseIndex={currentExerciseIndex}
              currentExercise={currentExercise}
              currentSet={currentSet}
              currentReps={currentReps}
              setCurrentReps={setCurrentReps}
              completeSet={completeSet}
              setIsTracking={setIsTracking}
              setCurrentScreen={setCurrentScreen}
              startExercise={startExercise}
            />
          )}

          {currentScreen === "help" && <HelpScreen />}

          <BottomNav currentScreen={currentScreen} setCurrentScreen={handleScreenChange} />
        </div>
      </div>
    </div>
  );
}