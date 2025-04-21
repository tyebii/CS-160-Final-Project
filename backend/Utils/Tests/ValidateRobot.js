// Require validateRobot from your utils
const { validateRobot } = require('../Formatting'); // Adjust path if needed

// Mock response object
function createMockRes() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
}

// ✅ Valid Robot Requests
const validRobots = [
  {
    body: {
      RobotID: "robot123",
      CurrentLoad: 5,
      RobotStatus: "Free",
      Maintanence: "2099-12-31",
      Speed: 10,
      BatteryLife: 90,
      EstimatedDelivery: 15
    }
  }
];

// ❌ Invalid Robots (bad ID, load, status, or date)
const invalidRobots = [
  {
    body: {
      RobotID: "bad id", // space = invalid
      CurrentLoad: 5,
      RobotStatus: "Free",
      Maintanence: "2099-12-31",
      Speed: 10,
      BatteryLife: 90,
      EstimatedDelivery: 15
    }
  },
  {
    body: {
      RobotID: "robot123",
      CurrentLoad: -1,
      RobotStatus: "Free",
      Maintanence: "2099-12-31",
      Speed: 10,
      BatteryLife: 90,
      EstimatedDelivery: 15
    }
  },
  {
    body: {
      RobotID: "robot123",
      CurrentLoad: 5,
      RobotStatus: "Offline", // not in allowed list
      Maintanence: "2099-12-31",
      Speed: 10,
      BatteryLife: 90,
      EstimatedDelivery: 15
    }
  },
  {
    body: {
      RobotID: "robot123",
      CurrentLoad: 5,
      RobotStatus: "Free",
      Maintanence: "2020-01-01", // past date
      Speed: 10,
      BatteryLife: 90,
      EstimatedDelivery: 15
    }
  },
  {
    body: {
      RobotID: "robot123",
      CurrentLoad: 5,
      RobotStatus: "Free",
      Maintanence: "2099-12-31",
      Speed: -1, // invalid speed
      BatteryLife: 90,
      EstimatedDelivery: 15
    }
  },
  {
    body: {
      RobotID: "robot123",
      CurrentLoad: 5,
      RobotStatus: "Free",
      Maintanence: "2099-12-31",
      Speed: 10,
      BatteryLife: "high", // invalid type
      EstimatedDelivery: 15
    }
  }
];

// ❌ Blacklisted Robots
const blacklistRobots = [
  {
    body: {
      RobotID: "robot<script>",
      CurrentLoad: 5,
      RobotStatus: "Free",
      Maintanence: "2099-12-31",
      Speed: 10,
      BatteryLife: 90,
      EstimatedDelivery: 15
    }
  }
];

// Helper to run tests
async function runTests(label, cases, shouldCallNext = true) {
  console.log(`\n${label}`);
  for (const input of cases) {
    let calledNext = false;
    const req = JSON.parse(JSON.stringify(input));
    const res = createMockRes();
    const next = () => { calledNext = true; };

    await validateRobot(req, res, next);
    const pass = calledNext === shouldCallNext ? "✅" : "❌";
    console.log(`${pass} validateRobot(${JSON.stringify(req.body)}) -> status: ${res.statusCode || "N/A"}`);
  }
}

// Run test groups
(async () => {
  await runTests("Valid Robots", validRobots, true);
  await runTests("Invalid Robots", invalidRobots, false);
  await runTests("Blacklisted Robots", blacklistRobots, false);
})();
