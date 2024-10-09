// test/LogManager.test.ts

import { LogManager } from "../../src/syncer";
import { LogSyncer } from "../../src/base/LogSyncer";
import { AccessLog, ApplicationLog } from "../../src/base";

// 创建一个模拟的 LogSyncer
class MockLogSyncer extends LogSyncer {
  syncAccessLog = jest.fn().mockResolvedValue(undefined);
  syncLoginLog = jest.fn().mockResolvedValue(undefined);
  syncApplicationLog = jest.fn().mockResolvedValue(undefined);
  syncSecurityLog = jest.fn().mockResolvedValue(undefined);
  syncTraceLog = jest.fn().mockResolvedValue(undefined);
  queryAccessLogs = jest.fn();
  queryApplicationLogs = jest.fn();
  countAccessLogs = jest.fn();
  countApplicationLogs = jest.fn();
  countDistinctUsersAccessLogs = jest.fn();
  countDistinctUsersApplicationLogs = jest.fn();
  queryLogsByTraceId = jest.fn();
}

describe("LogManager", () => {
  let logManager: LogManager;
  let syncers: MockLogSyncer[];

  beforeEach(() => {
    syncers = [new MockLogSyncer(), new MockLogSyncer()];
    logManager = new LogManager(syncers);
  });

  it("should sync access log to all syncers", async () => {
    const log: AccessLog = {
      traceId: "trace123",
      timestamp: Date.now(),
      level: "info",
      message: "Access log message",
      logType: "entry",
      requestTime: Date.now(),
      ipAddress: "127.0.0.1",
      requestUrl: "/api/test",
      httpMethod: "GET",
      statusCode: 200,
      userAgent: "Mozilla/5.0",
      responseTime: Date.now(),
    };

    await logManager.logAccess(log);

    syncers.forEach((syncer) => {
      expect(syncer.syncAccessLog).toHaveBeenCalledWith(log);
    });
  });

  it("should sync login log to all syncers", async () => {
    const log: ApplicationLog = {
      traceId: "trace456",
      timestamp: Date.now(),
      level: "info",
      message: "Login log message",
      logType: "entry",
      action: "login",
      details: {},
      eventType: "login",
      loginResult: "success",
    };

    await logManager.logLogin(log);

    syncers.forEach((syncer) => {
      expect(syncer.syncLoginLog).toHaveBeenCalledWith(log);
    });
  });

  it("should sync application log to all syncers", async () => {
    const log: ApplicationLog = {
      traceId: "trace789",
      timestamp: Date.now(),
      level: "info",
      message: "Application log message",
      logType: "entry",
      action: "testAction",
      details: { key: "value" },
      eventType: "operation",
    };

    await logManager.logApplication(log);

    syncers.forEach((syncer) => {
      expect(syncer.syncApplicationLog).toHaveBeenCalledWith(log);
    });
  });

  it("should sync security log to all syncers", async () => {
    const log: ApplicationLog = {
      traceId: "trace101112",
      timestamp: Date.now(),
      level: "info",
      message: "Security log message",
      logType: "entry",
      action: "securityCheck",
      details: { key: "value" },
      eventType: "security",
    };

    await logManager.logSecurity(log);

    syncers.forEach((syncer) => {
      expect(syncer.syncSecurityLog).toHaveBeenCalledWith(log);
    });
  });

  it("should sync trace log to all syncers", async () => {
    const log: ApplicationLog = {
      traceId: "trace131415",
      timestamp: Date.now(),
      level: "info",
      message: "Trace log message",
      logType: "entry",
      action: "traceAction",
      details: { key: "value" },
      eventType: "trace",
      spanId: "span1",
      parentSpanId: "span0",
      service: "testService",
      operation: "testOperation",
      duration: 123,
      error: false,
    };

    await logManager.logTrace(log);

    syncers.forEach((syncer) => {
      expect(syncer.syncTraceLog).toHaveBeenCalledWith(log);
    });
  });
});
