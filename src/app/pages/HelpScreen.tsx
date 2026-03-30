export default function HelpScreen() {
  return (
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
  );
}
