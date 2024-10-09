// src/syncer/index.ts

import { AccessLog, ApplicationLog, Log } from "../base";
import { LogSyncer } from "../base/LogSyncer";

export class LogManager {
  private syncers: LogSyncer[];

  constructor(syncers: LogSyncer[]) {
    this.syncers = syncers;
  }

  private async syncLog(
    log: Log,
    syncMethod: (syncer: LogSyncer, log: Log) => Promise<void>
  ): Promise<void> {
    const syncPromises = this.syncers.map((syncer) => syncMethod(syncer, log));
    await Promise.all(syncPromises);
  }

  async logAccess(log: AccessLog): Promise<void> {
    await this.syncLog(log, (syncer) => syncer.syncAccessLog(log));
  }

  async logLogin(log: ApplicationLog): Promise<void> {
    // 这里使用 ApplicationLog 类型
    await this.syncLog(log, (syncer) => syncer.syncLoginLog(log));
  }

  async logApplication(log: ApplicationLog): Promise<void> {
    await this.syncLog(log, (syncer) => syncer.syncApplicationLog(log));
  }

  async logSecurity(log: ApplicationLog): Promise<void> {
    // 这里使用 ApplicationLog 类型
    await this.syncLog(log, (syncer) => syncer.syncSecurityLog(log));
  }

  async logTrace(log: ApplicationLog): Promise<void> {
    // 这里使用 ApplicationLog 类型
    await this.syncLog(log, (syncer) => syncer.syncTraceLog(log));
  }
}
