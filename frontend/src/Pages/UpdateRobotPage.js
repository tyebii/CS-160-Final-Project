import { useLocation } from "react-router-dom";

import { RobotUpdate } from "../Components/UpdateAddRobot/RobotUpdate"; 

export function UpdateRobotPage() {

    const location = useLocation();

    const robot = location.state;

    return (

        <RobotUpdate robot={robot} />

    );
    
}
