export function isNullOrEmpty(value: string | null) {
    return value == null || value == '';
}

export function debounce(func: (...args: string[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: string[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}