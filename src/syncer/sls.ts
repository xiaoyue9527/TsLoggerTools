interface SLSConfig {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
  project: string;
  accessLog?: string; // 可选的访问日志主题
  applicationLog?: string; // 可选的应用日志主题
}

// src/syncer/sls.ts

// @ts-ignore
import ALY from "aliyun-sdk";
import Sls20201230, * as $Sls20201230 from "@alicloud/sls20201230";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Util, * as $Util from "@alicloud/tea-util";
import { LogSyncer } from "../base/LogSyncer";
import { AccessLog, ApplicationLog, Sort } from "../base";
import SLSIndexJson from "../base/LogStoreIndex";

export class SLSLogSyncer extends LogSyncer {
  client2: any;
  private client: Sls20201230;
  private project: string;
  private accessLog: string;
  private applicationLog: string;

  async syncAccessLog(log: AccessLog): Promise<void> {
    await this.PutLogs(this.accessLog, log);
  }
  async syncLoginLog(log: ApplicationLog): Promise<void> {
    await this.PutLogs(this.applicationLog, log);
  }
  async syncApplicationLog(log: ApplicationLog): Promise<void> {
    await this.PutLogs(this.applicationLog, log);
  }
  async syncSecurityLog(log: ApplicationLog): Promise<void> {
    await this.PutLogs(this.applicationLog, log);
  }
  async syncTraceLog(log: ApplicationLog): Promise<void> {
    await this.PutLogs(this.applicationLog, log);
  }
  async queryAccessLogs(
    filter: Partial<AccessLog>,
    skip?: number,
    limit?: number,
    sort?: Sort
  ): Promise<AccessLog[]> {
    const query = this.buildQuery(filter, sort);
    const results: any = await this.GetLogs(this.accessLog, query);
    return results;
  }
  async queryApplicationLogs(
    filter: Partial<ApplicationLog>,
    skip?: number,
    limit?: number,
    sort?: Sort
  ): Promise<ApplicationLog[]> {
    const query = this.buildQuery(filter, sort);
    const results: any = await this.GetLogs(this.applicationLog, query);
    return results;
  }
  async countAccessLogs(filter: Partial<AccessLog>): Promise<number> {
    let query = "";
    if (typeof filter === "object") {
      for (let key in filter) {
        query += ` and ${key} = "${filter[key]}"`;
      }
    }
    const results: any = await this.GetLogs(
      this.accessLog,
      `* ${query} | select count(*) as num`
    );
    return results?.body || 0;
  }
  async countApplicationLogs(filter: Partial<ApplicationLog>): Promise<number> {
    let query = "";
    if (typeof filter === "object") {
      for (let key in filter) {
        query += ` and ${key} = "${filter[key]}"`;
      }
    }
    const results: any = await this.GetLogs(
      this.applicationLog,
      `* ${query} | select count(*) as num`
    );
    return results?.body || 0;
  }
  async countDistinctUsersAccessLogs(
    filter: Partial<ApplicationLog>
  ): Promise<number> {
    let query = "";
    if (typeof filter === "object") {
      for (let key in filter) {
        query += ` and ${key} = "${filter[key]}"`;
      }
    }
    const results: any = await this.GetLogs(
      this.accessLog,
      `* ${query} | select count(distinct userId) as num`
    );
    return results?.body || 0;
  }
  async countDistinctUsersApplicationLogs(
    filter: Partial<ApplicationLog>
  ): Promise<number> {
    let query = "";
    if (typeof filter === "object") {
      for (let key in filter) {
        query += ` and ${key} = "${filter[key]}"`;
      }
    }
    const results: any = await this.GetLogs(
      this.applicationLog,
      `* ${query} | select count(distinct userId) as num`
    );
    return results?.body || 0;
  }
  async queryLogsByTraceId(
    traceId: string
  ): Promise<{ accessLogs: AccessLog[]; applicationLogs: ApplicationLog[] }> {
    const ac: any = await this.GetLogs(
      this.accessLog,
      `* and traceId = ${traceId} `
    );
    const ap: any = await this.GetLogs(
      this.applicationLog,
      `* and traceId = ${traceId} `
    );
    return [...ac.body, ...ap.body] as any;
  }

  constructor(config: SLSConfig) {
    super();
    this.project = config.project;
    this.accessLog = config.accessLog || "accessLogs";
    this.applicationLog = config.applicationLog || "applicationLogs";
    this.client = SLSLogSyncer.createClient(config);
    this.client2 = new ALY.SLS({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.accessKeySecret,
      endpoint: `https://${config.endpoint}`,
      apiVersion: "2015-06-01",
    });
    this.initProject();
  }
  static createClient(data: SLSConfig): Sls20201230 {
    let config = new $OpenApi.Config({
      accessKeyId: data.accessKeyId,
      accessKeySecret: data.accessKeySecret,
    });
    config.endpoint = data.endpoint;
    return new Sls20201230(config);
  }
  getClient(): Sls20201230 {
    return this.client;
  }
  async initProject() {
    let project = await this.GetProject();
    if (!project) project = await this.CreateProject();
    if (project) {
      let accessLogs = await this.GetLogStore(this.accessLog);
      if (!accessLogs) accessLogs = await this.CreateLogStore(this.accessLog);
      let applicationLogs = await this.GetLogStore(this.applicationLog);
      if (!applicationLogs)
        applicationLogs = await this.CreateLogStore(this.applicationLog);
      if (!accessLogs || !applicationLogs)
        throw new Error("AccessLogs and applicationLogs must not found");

      await this.CreateIndex(this.accessLog, SLSIndexJson.accessLogs);
      await this.CreateIndex(this.applicationLog, SLSIndexJson.applicationLogs);
      console.log("Initializing project");
    } else {
      throw new Error("Project must be specified");
    }
  }
  async GetProject() {
    let runtime = new $Util.RuntimeOptions({});
    let headers: { [key: string]: string } = {};
    try {
      // 复制代码运行请自行打印 API 的返回值
      return await this.client.getProjectWithOptions(
        this.project,
        headers,
        runtime
      );
    } catch (error: any) {
      console.log(error);
      console.log(error.message);
      console.log(error?.data["Recommend"]);
      return null;
    }
  }
  async CreateProject() {
    let createProjectRequest = new $Sls20201230.CreateProjectRequest({
      description: "ts-logger-tools系统自动创建的SLS日志项目",
      projectName: this.project,
    });
    let runtime = new $Util.RuntimeOptions({});
    let headers: { [key: string]: string } = {};
    try {
      return await this.client.createProjectWithOptions(
        createProjectRequest,
        headers,
        runtime
      );
    } catch (error: any) {
      console.log(error.message);
      console.log(error.data["Recommend"]);
      return null;
    }
  }
  async GetLogStore(log: string) {
    let runtime = new $Util.RuntimeOptions({});
    let headers: { [key: string]: string } = {};
    try {
      return await this.client.getLogStoreWithOptions(
        this.project,
        log,
        headers,
        runtime
      );
    } catch (error: any) {
      console.log(error.message);
      console.log(error.data["Recommend"]);
      return null;
    }
  }
  async CreateLogStore(log: string) {
    let createLogStoreRequest = new $Sls20201230.CreateLogStoreRequest({
      logstoreName: log,
      shardCount: 2,
      ttl: 3650,
    });
    let runtime = new $Util.RuntimeOptions({});
    let headers: { [key: string]: string } = {};
    try {
      return await this.client.createLogStoreWithOptions(
        this.project,
        createLogStoreRequest,
        headers,
        runtime
      );
    } catch (error: any) {
      console.log(error.message);
      console.log(error.data["Recommend"]);
      return null;
    }
  }

  async CreateIndex(log: string, index: any) {
    const param = {
      projectName: this.project,
      logstoreName: log,
      indexDetail: {
        line: index.line,
        keys: index.keys,
      },
    };

    this.client2.createIndex(param, function (err: any, data: any) {
      if (err) {
        console.log(err?.message);
      } else {
        console.log("为logStore创建索引成功", data);
      }
    });
  }
  async PutLogs(log: string, logs: { [key: string]: any }) {
    const dictList = [];
    for (const i in logs) {
      const dict = {
        key: i,
        value: "",
      };
      try {
        if (typeof logs[i] === "string") {
          dict.value = logs[i];
        }
        if (["number", "boolean"].includes(typeof logs[i])) {
          dict.value = logs[i].toString();
        }
        if (typeof logs[i] === "object") {
          dict.value = JSON.stringify(logs[i]);
        }
        dictList.push(dict);
      } catch (e) {
        console.log(logs[i]);
        // console.error(e)
      }
    }
    const param = {
      projectName: this.project,
      logStoreName: log,
      logGroup: {
        // 必选，写入的日志数据。
        logs: [
          {
            time: Math.floor(new Date().getTime() / 1000),
            contents: dictList,
          },
        ],
        topic: log,
        source: "logistics.sk-yuan.com",
      },
    };
    this.client2.putLogs(param, function (err: any, data: any) {
      if (err) {
        console.error("error:", err);
      } else {
        // console.log('写入日志成功', data)
      }
    });
  }
  async GetLogs(
    log: string,
    query?: string,
    timeInterval: { from: number; to: number } = {
      from: new Date().getTime() - 24 * 60 * 60 * 60 * 1000,
      to: new Date().getTime(),
    }
  ) {
    console.log(timeInterval);
    const queryData: any = { from: timeInterval.from, to: timeInterval.to };
    if (query) queryData.query = query;
    let getLogsRequest = new $Sls20201230.GetLogsRequest(queryData);
    let runtime = new $Util.RuntimeOptions({});
    let headers: { [key: string]: string } = {};
    try {
      return await this.client.getLogsWithOptions(
        this.project,
        log,
        getLogsRequest,
        headers,
        runtime
      );
    } catch (error: any) {
      console.log(error.message);
      console.log(error.data["Recommend"]);
      return [];
    }
  }
  async CreateSavedSearch(
    logs: string,
    sqlStr: string,
    name: string,
    displayName: string,
    topic?: string
  ) {
    let createSavedSearchRequest = new $Sls20201230.CreateSavedSearchRequest({
      searchQuery: sqlStr,
      logstore: logs,
      topic: topic || logs,
      displayName: displayName,
      savedsearchName: name,
    });
    let runtime = new $Util.RuntimeOptions({});
    let headers: { [key: string]: string } = {};
    try {
      await this.client.createSavedSearchWithOptions(
        this.project,
        createSavedSearchRequest,
        headers,
        runtime
      );
    } catch (error: any) {
      console.log(error.message);
      console.log(error.data["Recommend"]);
      return null;
    }
  }
  buildQuery(filter: Partial<ApplicationLog>, sort?: Sort): string {
    let queryParts: string[] = [];

    // 处理过滤条件
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];
        if (typeof value === "string") {
          queryParts.push(`${key}='${value}'`);
        } else if (typeof value === "number") {
          queryParts.push(`${key}=${value}`);
        } else if (Array.isArray(value)) {
          queryParts.push(
            `${key} IN (${value.map((v) => `'${v}'`).join(", ")})`
          );
        }
      }
    }

    // 处理排序
    if (sort) {
      queryParts.push(`ORDER BY ${sort.field} ${sort.order?.toUpperCase()}`);
    }

    // 组合查询条件
    return queryParts.join(" AND ");
  }
}
