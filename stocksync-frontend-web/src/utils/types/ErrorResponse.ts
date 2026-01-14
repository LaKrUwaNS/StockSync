type ErrorResponse = {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
};

function isErrorResponse(obj: unknown): obj is ErrorResponse {
    if (typeof obj !== "object" || obj === null) return false;

    const error = obj as Record<string, unknown>;

    return (
        typeof error.timestamp === "string" &&
        typeof error.status === "number" &&
        typeof error.error === "string" &&
        typeof error.message === "string" &&
        typeof error.path === "string"
    );
}

export default ErrorResponse;
