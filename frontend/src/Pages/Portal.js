import SystemAlerts from "../Components/Portal/SystemAlerts";
import FlaggedItems from "../Components/Portal/FlaggedItems";
const Portal = () => {
  return (
    <div className="bg-gray-300 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Portal</h1>

      {/* System Alerts Section */}
      <SystemAlerts />

      {/* Flagged Items Section */}
      <FlaggedItems />
    </div>
  );
};

export default Portal;
