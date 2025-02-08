export const getChangedColor = (type: string): string => {
    switch (type) {
        case "SAME":
            return "light-grey";
        case "ADDED":
            return "green";
        case "REMOVED":
            return "red";
        case "MODIFIED":
            return "blue";
        default:
            return "white";
    }
};

export function getCommonDateString(): string {
    return new Date(Date.now()).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}