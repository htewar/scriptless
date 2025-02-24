export function isNullOrEmpty(value: string | null) {
    return value == null || value == '';
}

export function debounce(func: (...args: never[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: never[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}