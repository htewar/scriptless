import { useEffect, RefObject } from "react";

const useOutsideClick = (menuRef: RefObject<HTMLDivElement>, onClose: () => void) => {
    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose(); // Call the provided function to close the dropdown
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuRef, onClose]);
};

export default useOutsideClick;
