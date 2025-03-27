const SystemAlerts = () => {
  return (
    <div className="bg-white p-4 border shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-3">System Alerts</h2>
      <div className="border p-4">
        <p>
          <strong>Low Stock Triggers:</strong>
        </p>
        <p>
          <strong>Expiration Date Triggers:</strong>
        </p>
        <p>
          <strong>Robot Malfunctions:</strong>
        </p>
      </div>
    </div>
  );
};

export default SystemAlerts;
