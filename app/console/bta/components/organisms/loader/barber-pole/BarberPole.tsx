import { FC } from "react";

interface BarberPoleProps {
    isActive?: boolean;
}

const BarberPole: FC<BarberPoleProps> = ({ isActive = false }) => {
    return isActive ? (<div className="bbpole__wrapper">
        <span className="bbpole__loader"></span>
    </div>) : null
}

export default BarberPole;