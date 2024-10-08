import { Filter } from "mongodb";
import { AccessLog, ApplicationLog, Sort } from "../base";
import { LogSyncer } from "../base/LogSyncer";
export declare class MongoDBLogSyncer extends LogSyncer {
    private client;
    private db;
    private accessLogs;
    private applicationLogs;
    constructor(url: string, dbname: string);
    connect(): Promise<void>;
    syncAccessLog(log: AccessLog): Promise<void>;
    syncLoginLog(log: ApplicationLog): Promise<void>;
    syncApplicationLog(log: ApplicationLog): Promise<void>;
    syncSecurityLog(log: ApplicationLog): Promise<void>;
    syncTraceLog(log: ApplicationLog): Promise<void>;
    queryAccessLogs(filter: Filter<AccessLog>, skip?: number, limit?: number, sort?: Sort): Promise<AccessLog[]>;
    queryApplicationLogs(filter: Filter<ApplicationLog>, skip?: number, limit?: number, sort?: Sort): Promise<ApplicationLog[]>;
    countAccessLogs(filter: Filter<AccessLog>): Promise<number>;
    countApplicationLogs(filter: Filter<ApplicationLog>): Promise<number>;
    countDistinctUsersAccessLogs(filter: Filter<AccessLog>): Promise<number>;
    countDistinctUsersApplicationLogs(filter: Filter<ApplicationLog>): Promise<number>;
    queryLogsByTraceId(traceId: string): Promise<{
        accessLogs: AccessLog[];
        applicationLogs: ApplicationLog[];
    }>;
    close(): Promise<void>;
    private convertSort;
}
