import { AccessLog, ApplicationLog } from "../base";
import { LogSyncer } from "../base/LogSyncer";
export declare class LogManager {
    private syncers;
    constructor(syncers: LogSyncer[]);
    private syncLog;
    logAccess(log: AccessLog): Promise<void>;
    logLogin(log: ApplicationLog): Promise<void>;
    logApplication(log: ApplicationLog): Promise<void>;
    logSecurity(log: ApplicationLog): Promise<void>;
    logTrace(log: ApplicationLog): Promise<void>;
}
