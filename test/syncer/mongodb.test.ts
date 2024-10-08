// test/syncer/mongodb.test.ts

import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoDBLogSyncer } from "../../src/syncer/mongodb";
import { AccessLog, ApplicationLog } from "../../src/base";

let mongoServer: MongoMemoryServer;
let syncer: MongoDBLogSyncer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  syncer = new MongoDBLogSyncer(uri, "testdb");
  await syncer.connect();
});

afterAll(async () => {
  await syncer.close();
  await mongoServer.stop();
});

describe("MongoDBLogSyncer", () => {
  it("should insert an access log", async () => {
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
      userId: "user1", // 添加 userId
    };

    await syncer.syncAccessLog(log);

    const insertedLog = await (syncer as any).accessLogs.findOne({
      traceId: "trace123",
    });
    expect(insertedLog).toMatchObject(log);
  });

  it("should insert an application log", async () => {
    const log: ApplicationLog = {
      traceId: "trace456",
      timestamp: Date.now(),
      level: "info",
      message: "Application log message",
      logType: "entry",
      action: "testAction",
      details: { key: "value" },
      eventType: "operation",
      userId: "user2", // 添加 userId
    };

    await syncer.syncApplicationLog(log);

    const insertedLog = await (syncer as any).applicationLogs.findOne({
      traceId: "trace456",
    });
    expect(insertedLog).toMatchObject(log);
  });

  it("should query access logs", async () => {
    const logs = await syncer.queryAccessLogs({ traceId: "trace123" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].traceId).toBe("trace123");
  });

  it("should query application logs", async () => {
    const logs = await syncer.queryApplicationLogs({ traceId: "trace456" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].traceId).toBe("trace456");
  });

  it("should count access logs", async () => {
    const count = await syncer.countAccessLogs({ traceId: "trace123" });
    expect(count).toBeGreaterThan(0);
  });

  it("should count application logs", async () => {
    const count = await syncer.countApplicationLogs({ traceId: "trace456" });
    expect(count).toBeGreaterThan(0);
  });

  it("should count distinct users in access logs", async () => {
    // 插入多个日志以确保有不同的 userId
    await syncer.syncAccessLog({
      traceId: "trace789",
      timestamp: Date.now(),
      level: "info",
      message: "Another access log",
      logType: "entry",
      requestTime: Date.now(),
      ipAddress: "127.0.0.1",
      requestUrl: "/api/another",
      httpMethod: "POST",
      statusCode: 201,
      userAgent: "Mozilla/5.0",
      responseTime: Date.now(),
      userId: "user3",
    });

    const count = await syncer.countDistinctUsersAccessLogs({});
    expect(count).toBeGreaterThan(0);
  });

  it("should count distinct users in application logs", async () => {
    // 插入多个日志以确保有不同的 userId
    await syncer.syncApplicationLog({
      traceId: "trace789",
      timestamp: Date.now(),
      level: "info",
      message: "Another application log",
      logType: "entry",
      action: "anotherAction",
      details: { key: "anotherValue" },
      eventType: "operation",
      userId: "user4",
    });

    const count = await syncer.countDistinctUsersApplicationLogs({});
    expect(count).toBeGreaterThan(0);
  });

  it("should query logs by trace ID", async () => {
    const result = await syncer.queryLogsByTraceId("trace123");
    expect(result.accessLogs.length).toBeGreaterThan(0);
    expect(result.accessLogs[0].traceId).toBe("trace123");

    const resultAppLogs = await syncer.queryLogsByTraceId("trace456");
    expect(resultAppLogs.applicationLogs.length).toBeGreaterThan(0);
    expect(resultAppLogs.applicationLogs[0].traceId).toBe("trace456");
  });
});
