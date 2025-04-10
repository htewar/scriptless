import { FC, useEffect, useState } from "react";

interface StatusIndicatorProps {
    progress?: number;
}

const StatusIndicator: FC<StatusIndicatorProps> = ({ progress = 0 }) => {
    const [currentProgress, setCurrentProgress] = useState<number>(0);

    useEffect(() => {
        setCurrentProgress(prevState => prevState + progress)
    }, [progress])

    useEffect(() => {
        if (progress == 0) setCurrentProgress(0);
    }, [progress])
    return <div className="statusIndicator">
        <span style={{ width: `${currentProgress}%` }} className="statusIndicator__progress" />
    </div>
}

export default StatusIndicator;