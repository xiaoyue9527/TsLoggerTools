"use strict";
// src/syncer/mongodb.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBLogSyncer = void 0;
const mongodb_1 = require("mongodb");
const LogSyncer_1 = require("../base/LogSyncer");
class MongoDBLogSyncer extends LogSyncer_1.LogSyncer {
    constructor(url, dbname) {
        super();
        this.client = new mongodb_1.MongoClient(url);
        this.db = this.client.db(dbname);
        this.accessLogs = this.db.collection("accessLogs");
        this.applicationLogs = this.db.collection("applicationLogs");
    }
    async connect() {
        await this.client.connect();
    }
    async syncAccessLog(log) {
        await this.accessLogs.insertOne(log);
    }
    async syncLoginLog(log) {
        await this.syncApplicationLog(log);
    }
    async syncApplicationLog(log) {
        await this.applicationLogs.insertOne(log);
    }
    async syncSecurityLog(log) {
        await this.syncApplicationLog(log);
    }
    async syncTraceLog(log) {
        await this.syncApplicationLog(log);
    }
    async queryAccessLogs(filter, skip = 0, limit = 10, sort) {
        const mongoSort = this.convertSort(sort);
        return this.accessLogs
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort(mongoSort)
            .toArray();
    }
    async queryApplicationLogs(filter, skip = 0, limit = 10, sort) {
        const mongoSort = this.convertSort(sort);
        return this.applicationLogs
            .find(filter)
            .skip(skip)
            .limit(limit)
            .sort(mongoSort)
            .toArray();
    }
    async countAccessLogs(filter) {
        return this.accessLogs.countDocuments(filter);
    }
    async countApplicationLogs(filter) {
        return this.applicationLogs.countDocuments(filter);
    }
    async countDistinctUsersAccessLogs(filter) {
        return this.accessLogs
            .distinct("userId", filter)
            .then((users) => users.length);
    }
    async countDistinctUsersApplicationLogs(filter) {
        return this.applicationLogs
            .distinct("userId", filter)
            .then((users) => users.length);
    }
    async queryLogsByTraceId(traceId) {
        const accessLogs = await this.accessLogs.find({ traceId }).toArray();
        const applicationLogs = await this.applicationLogs
            .find({ traceId })
            .toArray();
        return { accessLogs, applicationLogs };
    }
    async close() {
        await this.client.close();
    }
    convertSort(sort) {
        if (!sort)
            return {};
        const mongoSort = {};
        for (const [field, order] of Object.entries(sort)) {
            mongoSort[field] = order === "asc" ? 1 : -1;
        }
        return mongoSort;
    }
}
exports.MongoDBLogSyncer = MongoDBLogSyncer;
