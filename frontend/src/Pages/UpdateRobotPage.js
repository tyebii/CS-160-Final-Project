import { useLocation } from "react-router-dom";
import { RobotUpdate } from "../Components/UpdateRobot/RobotUpdate"; // Ensure the component name is capitalized

export function UpdateRobotPage() {
    const location = useLocation();
    const robot = location.state;

    return (
        <RobotUpdate robot={robot} />
    );
}
