import SystemAlerts from "../Components/Portal/SystemAlerts";

const Portal = () => {
  return (
    <div className="bg-gray-300 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Portal</h1>

      {/* System Alerts Section */}
      <SystemAlerts />

    </div>
  );
};

export default Portal;
