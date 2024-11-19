interface SLSConfig {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: string;
    project: string;
    accessLog?: string;
    applicationLog?: string;
}
import Sls20201230, * as $Sls20201230 from "@alicloud/sls20201230";
import { LogSyncer } from "../base/LogSyncer";
import { AccessLog, ApplicationLog, Sort } from "../base";
export declare class SLSLogSyncer extends LogSyncer {
    client2: any;
    private client;
    private project;
    private accessLog;
    private applicationLog;
    syncAccessLog(log: AccessLog): Promise<void>;
    syncLoginLog(log: ApplicationLog): Promise<void>;
    syncApplicationLog(log: ApplicationLog): Promise<void>;
    syncSecurityLog(log: ApplicationLog): Promise<void>;
    syncTraceLog(log: ApplicationLog): Promise<void>;
    queryAccessLogs(filter: Partial<AccessLog>, skip?: number, limit?: number, sort?: Sort): Promise<AccessLog[]>;
    queryApplicationLogs(filter: Partial<ApplicationLog>, skip?: number, limit?: number, sort?: Sort): Promise<ApplicationLog[]>;
    countAccessLogs(filter: Partial<AccessLog>): Promise<number>;
    countApplicationLogs(filter: Partial<ApplicationLog>): Promise<number>;
    countDistinctUsersAccessLogs(filter: Partial<ApplicationLog>): Promise<number>;
    countDistinctUsersApplicationLogs(filter: Partial<ApplicationLog>): Promise<number>;
    queryLogsByTraceId(traceId: string): Promise<{
        accessLogs: AccessLog[];
        applicationLogs: ApplicationLog[];
    }>;
    constructor(config: SLSConfig);
    static createClient(data: SLSConfig): Sls20201230;
    getClient(): Sls20201230;
    initProject(): Promise<void>;
    GetProject(): Promise<$Sls20201230.GetProjectResponse | null>;
    CreateProject(): Promise<$Sls20201230.CreateProjectResponse | null>;
    GetLogStore(log: string): Promise<$Sls20201230.GetLogStoreResponse | null>;
    CreateLogStore(log: string): Promise<$Sls20201230.CreateLogStoreResponse | null>;
    CreateIndex(log: string, index: any): Promise<void>;
    PutLogs(log: string, logs: {
        [key: string]: any;
    }): Promise<void>;
    GetLogs(log: string, query?: string, timeInterval?: {
        from: number;
        to: number;
    }): Promise<never[] | $Sls20201230.GetLogsResponse>;
    CreateSavedSearch(logs: string, sqlStr: string, name: string, displayName: string, topic?: string): Promise<null | undefined>;
    buildQuery(filter: Partial<ApplicationLog>, sort?: Sort): string;
}
export {};
