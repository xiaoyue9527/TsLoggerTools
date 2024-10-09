"use strict";
// src/syncer/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogManager = void 0;
class LogManager {
    constructor(syncers) {
        this.syncers = syncers;
    }
    async syncLog(log, syncMethod) {
        const syncPromises = this.syncers.map((syncer) => syncMethod(syncer, log));
        await Promise.all(syncPromises);
    }
    async logAccess(log) {
        await this.syncLog(log, (syncer) => syncer.syncAccessLog(log));
    }
    async logLogin(log) {
        // 这里使用 ApplicationLog 类型
        await this.syncLog(log, (syncer) => syncer.syncLoginLog(log));
    }
    async logApplication(log) {
        await this.syncLog(log, (syncer) => syncer.syncApplicationLog(log));
    }
    async logSecurity(log) {
        // 这里使用 ApplicationLog 类型
        await this.syncLog(log, (syncer) => syncer.syncSecurityLog(log));
    }
    async logTrace(log) {
        // 这里使用 ApplicationLog 类型
        await this.syncLog(log, (syncer) => syncer.syncTraceLog(log));
    }
}
exports.LogManager = LogManager;
