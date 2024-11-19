"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLSLogSyncer = void 0;
// src/syncer/sls.ts
// @ts-ignore
const aliyun_sdk_1 = __importDefault(require("aliyun-sdk"));
const sls20201230_1 = __importStar(require("@alicloud/sls20201230")), $Sls20201230 = sls20201230_1;
const $OpenApi = __importStar(require("@alicloud/openapi-client"));
const $Util = __importStar(require("@alicloud/tea-util"));
const LogSyncer_1 = require("../base/LogSyncer");
const LogStoreIndex_1 = __importDefault(require("../base/LogStoreIndex"));
class SLSLogSyncer extends LogSyncer_1.LogSyncer {
    async syncAccessLog(log) {
        await this.PutLogs(this.accessLog, log);
    }
    async syncLoginLog(log) {
        await this.PutLogs(this.applicationLog, log);
    }
    async syncApplicationLog(log) {
        await this.PutLogs(this.applicationLog, log);
    }
    async syncSecurityLog(log) {
        await this.PutLogs(this.applicationLog, log);
    }
    async syncTraceLog(log) {
        await this.PutLogs(this.applicationLog, log);
    }
    async queryAccessLogs(filter, skip, limit, sort) {
        const query = this.buildQuery(filter, sort);
        const results = await this.GetLogs(this.accessLog, query);
        return results;
    }
    async queryApplicationLogs(filter, skip, limit, sort) {
        const query = this.buildQuery(filter, sort);
        const results = await this.GetLogs(this.applicationLog, query);
        return results;
    }
    async countAccessLogs(filter) {
        let query = "";
        if (typeof filter === "object") {
            for (let key in filter) {
                query += ` and ${key} = "${filter[key]}"`;
            }
        }
        const results = await this.GetLogs(this.accessLog, `* ${query} | select count(*) as num`);
        return results?.body || 0;
    }
    async countApplicationLogs(filter) {
        let query = "";
        if (typeof filter === "object") {
            for (let key in filter) {
                query += ` and ${key} = "${filter[key]}"`;
            }
        }
        const results = await this.GetLogs(this.applicationLog, `* ${query} | select count(*) as num`);
        return results?.body || 0;
    }
    async countDistinctUsersAccessLogs(filter) {
        let query = "";
        if (typeof filter === "object") {
            for (let key in filter) {
                query += ` and ${key} = "${filter[key]}"`;
            }
        }
        const results = await this.GetLogs(this.accessLog, `* ${query} | select count(distinct userId) as num`);
        return results?.body || 0;
    }
    async countDistinctUsersApplicationLogs(filter) {
        let query = "";
        if (typeof filter === "object") {
            for (let key in filter) {
                query += ` and ${key} = "${filter[key]}"`;
            }
        }
        const results = await this.GetLogs(this.applicationLog, `* ${query} | select count(distinct userId) as num`);
        return results?.body || 0;
    }
    async queryLogsByTraceId(traceId) {
        const ac = await this.GetLogs(this.accessLog, `* and traceId = ${traceId} `);
        const ap = await this.GetLogs(this.applicationLog, `* and traceId = ${traceId} `);
        return [...ac.body, ...ap.body];
    }
    constructor(config) {
        super();
        this.project = config.project;
        this.accessLog = config.accessLog || "accessLogs";
        this.applicationLog = config.applicationLog || "applicationLogs";
        this.client = SLSLogSyncer.createClient(config);
        this.client2 = new aliyun_sdk_1.default.SLS({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.accessKeySecret,
            endpoint: `https://${config.endpoint}`,
            apiVersion: "2015-06-01",
        });
        this.initProject();
    }
    static createClient(data) {
        let config = new $OpenApi.Config({
            accessKeyId: data.accessKeyId,
            accessKeySecret: data.accessKeySecret,
        });
        config.endpoint = data.endpoint;
        return new sls20201230_1.default(config);
    }
    getClient() {
        return this.client;
    }
    async initProject() {
        let project = await this.GetProject();
        if (!project)
            project = await this.CreateProject();
        if (project) {
            let accessLogs = await this.GetLogStore(this.accessLog);
            if (!accessLogs)
                accessLogs = await this.CreateLogStore(this.accessLog);
            let applicationLogs = await this.GetLogStore(this.applicationLog);
            if (!applicationLogs)
                applicationLogs = await this.CreateLogStore(this.applicationLog);
            if (!accessLogs || !applicationLogs)
                throw new Error("AccessLogs and applicationLogs must not found");
            await this.CreateIndex(this.accessLog, LogStoreIndex_1.default.accessLogs);
            await this.CreateIndex(this.applicationLog, LogStoreIndex_1.default.applicationLogs);
            console.log("Initializing project");
        }
        else {
            throw new Error("Project must be specified");
        }
    }
    async GetProject() {
        let runtime = new $Util.RuntimeOptions({});
        let headers = {};
        try {
            // 复制代码运行请自行打印 API 的返回值
            return await this.client.getProjectWithOptions(this.project, headers, runtime);
        }
        catch (error) {
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
        let headers = {};
        try {
            return await this.client.createProjectWithOptions(createProjectRequest, headers, runtime);
        }
        catch (error) {
            console.log(error.message);
            console.log(error.data["Recommend"]);
            return null;
        }
    }
    async GetLogStore(log) {
        let runtime = new $Util.RuntimeOptions({});
        let headers = {};
        try {
            return await this.client.getLogStoreWithOptions(this.project, log, headers, runtime);
        }
        catch (error) {
            console.log(error.message);
            console.log(error.data["Recommend"]);
            return null;
        }
    }
    async CreateLogStore(log) {
        let createLogStoreRequest = new $Sls20201230.CreateLogStoreRequest({
            logstoreName: log,
            shardCount: 2,
            ttl: 3650,
        });
        let runtime = new $Util.RuntimeOptions({});
        let headers = {};
        try {
            return await this.client.createLogStoreWithOptions(this.project, createLogStoreRequest, headers, runtime);
        }
        catch (error) {
            console.log(error.message);
            console.log(error.data["Recommend"]);
            return null;
        }
    }
    async CreateIndex(log, index) {
        const param = {
            projectName: this.project,
            logstoreName: log,
            indexDetail: {
                line: index.line,
                keys: index.keys,
            },
        };
        this.client2.createIndex(param, function (err, data) {
            if (err) {
                console.log(err?.message);
            }
            else {
                console.log("为logStore创建索引成功", data);
            }
        });
    }
    async PutLogs(log, logs) {
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
            }
            catch (e) {
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
        this.client2.putLogs(param, function (err, data) {
            if (err) {
                console.error("error:", err);
            }
            else {
                // console.log('写入日志成功', data)
            }
        });
    }
    async GetLogs(log, query, timeInterval = {
        from: new Date().getTime() - 24 * 60 * 60 * 60 * 1000,
        to: new Date().getTime(),
    }) {
        console.log(timeInterval);
        const queryData = { from: timeInterval.from, to: timeInterval.to };
        if (query)
            queryData.query = query;
        let getLogsRequest = new $Sls20201230.GetLogsRequest(queryData);
        let runtime = new $Util.RuntimeOptions({});
        let headers = {};
        try {
            return await this.client.getLogsWithOptions(this.project, log, getLogsRequest, headers, runtime);
        }
        catch (error) {
            console.log(error.message);
            console.log(error.data["Recommend"]);
            return [];
        }
    }
    async CreateSavedSearch(logs, sqlStr, name, displayName, topic) {
        let createSavedSearchRequest = new $Sls20201230.CreateSavedSearchRequest({
            searchQuery: sqlStr,
            logstore: logs,
            topic: topic || logs,
            displayName: displayName,
            savedsearchName: name,
        });
        let runtime = new $Util.RuntimeOptions({});
        let headers = {};
        try {
            await this.client.createSavedSearchWithOptions(this.project, createSavedSearchRequest, headers, runtime);
        }
        catch (error) {
            console.log(error.message);
            console.log(error.data["Recommend"]);
            return null;
        }
    }
    buildQuery(filter, sort) {
        let queryParts = [];
        // 处理过滤条件
        for (const key in filter) {
            if (filter.hasOwnProperty(key)) {
                const value = filter[key];
                if (typeof value === "string") {
                    queryParts.push(`${key}='${value}'`);
                }
                else if (typeof value === "number") {
                    queryParts.push(`${key}=${value}`);
                }
                else if (Array.isArray(value)) {
                    queryParts.push(`${key} IN (${value.map((v) => `'${v}'`).join(", ")})`);
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
exports.SLSLogSyncer = SLSLogSyncer;
