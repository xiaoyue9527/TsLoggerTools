// src/base/LogSyncer.ts

import { AccessLog, ApplicationLog, Sort } from ".";

// 抽象日志同步器基类
export abstract class LogSyncer {
  // 同步日志方法
  abstract syncAccessLog(log: AccessLog): Promise<void>;
  abstract syncLoginLog(log: ApplicationLog): Promise<void>;
  abstract syncApplicationLog(log: ApplicationLog): Promise<void>;
  abstract syncSecurityLog(log: ApplicationLog): Promise<void>;
  abstract syncTraceLog(log: ApplicationLog): Promise<void>;

  // 查询日志方法
  abstract queryAccessLogs(
    filter: any,
    skip?: number,
    limit?: number,
    sort?: Sort
  ): Promise<AccessLog[]>;
  abstract queryApplicationLogs(
    filter: any,
    skip?: number,
    limit?: number,
    sort?: Sort
  ): Promise<ApplicationLog[]>;

  // 计数日志方法
  abstract countAccessLogs(filter: any): Promise<number>;
  abstract countApplicationLogs(filter: any): Promise<number>;

  // 统计不同用户数量的方法
  abstract countDistinctUsersAccessLogs(filter: any): Promise<number>;
  abstract countDistinctUsersApplicationLogs(filter: any): Promise<number>;

  // 查询指定链路ID的所有日志
  abstract queryLogsByTraceId(
    traceId: string
  ): Promise<{ accessLogs: AccessLog[]; applicationLogs: ApplicationLog[] }>;
}
