import { AccessLog, ApplicationLog, Sort } from ".";
export declare abstract class LogSyncer {
    abstract syncAccessLog(log: AccessLog): Promise<void>;
    abstract syncLoginLog(log: ApplicationLog): Promise<void>;
    abstract syncApplicationLog(log: ApplicationLog): Promise<void>;
    abstract syncSecurityLog(log: ApplicationLog): Promise<void>;
    abstract syncTraceLog(log: ApplicationLog): Promise<void>;
    abstract queryAccessLogs(filter: any, skip?: number, limit?: number, sort?: Sort): Promise<AccessLog[]>;
    abstract queryApplicationLogs(filter: any, skip?: number, limit?: number, sort?: Sort): Promise<ApplicationLog[]>;
    abstract countAccessLogs(filter: any): Promise<number>;
    abstract countApplicationLogs(filter: any): Promise<number>;
    abstract countDistinctUsersAccessLogs(filter: any): Promise<number>;
    abstract countDistinctUsersApplicationLogs(filter: any): Promise<number>;
    abstract queryLogsByTraceId(traceId: string): Promise<{
        accessLogs: AccessLog[];
        applicationLogs: ApplicationLog[];
    }>;
}
