import {SyncLoader} from "react-spinners";

export default function FullScreenSyncLoader() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <SyncLoader
                margin={4}
                size={15}
                speedMultiplier={1}
            />
        </div>
    )
}