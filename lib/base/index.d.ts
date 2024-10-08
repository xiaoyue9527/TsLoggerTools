type SortOrder = "asc" | "desc";
export interface Sort {
    [field: string]: SortOrder;
}
export interface Log {
    traceId: string;
    timestamp: number;
    level: string;
    message: string;
    logType: "entry" | "exit";
    [key: string]: any;
}
export interface AccessLog extends Log {
    requestTime: number;
    ipAddress: string;
    requestUrl: string;
    httpMethod: string;
    statusCode: number;
    userAgent: string;
    responseTime: number;
    userId?: string;
    string?: string;
}
export interface ApplicationLog extends Log {
    action: string;
    userId?: string;
    details: any;
    eventType: "login" | "security" | "trace" | "operation";
    loginResult?: "success" | "failure";
    failureReason?: string;
    spanId?: string;
    parentSpanId?: string;
    service?: string;
    operation?: string;
    duration?: number;
    error?: boolean;
}
export {};
