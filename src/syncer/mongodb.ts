// src/syncer/mongodb.ts

import { MongoClient, Db, Collection, Filter } from "mongodb";
import { AccessLog, ApplicationLog, Sort } from "../base";
import { LogSyncer } from "../base/LogSyncer";

export class MongoDBLogSyncer extends LogSyncer {
  private client: MongoClient;
  private db: Db;
  private accessLogs: Collection<AccessLog>;
  private applicationLogs: Collection<ApplicationLog>;

  constructor(url: string, dbname: string) {
    super();
    this.client = new MongoClient(url);
    this.db = this.client.db(dbname);
    this.accessLogs = this.db.collection("accessLogs");
    this.applicationLogs = this.db.collection("applicationLogs");
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async syncAccessLog(log: AccessLog): Promise<void> {
    await this.accessLogs.insertOne(log);
  }

  async syncLoginLog(log: ApplicationLog): Promise<void> {
    await this.syncApplicationLog(log);
  }

  async syncApplicationLog(log: ApplicationLog): Promise<void> {
    await this.applicationLogs.insertOne(log);
  }

  async syncSecurityLog(log: ApplicationLog): Promise<void> {
    await this.syncApplicationLog(log);
  }

  async syncTraceLog(log: ApplicationLog): Promise<void> {
    await this.syncApplicationLog(log);
  }

  async queryAccessLogs(
    filter: Filter<AccessLog>,
    skip: number = 0,
    limit: number = 10,
    sort?: Sort
  ): Promise<AccessLog[]> {
    const mongoSort = this.convertSort(sort);
    return this.accessLogs
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(mongoSort)
      .toArray();
  }

  async queryApplicationLogs(
    filter: Filter<ApplicationLog>,
    skip: number = 0,
    limit: number = 10,
    sort?: Sort
  ): Promise<ApplicationLog[]> {
    const mongoSort = this.convertSort(sort);
    return this.applicationLogs
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(mongoSort)
      .toArray();
  }

  async countAccessLogs(filter: Filter<AccessLog>): Promise<number> {
    return this.accessLogs.countDocuments(filter);
  }

  async countApplicationLogs(filter: Filter<ApplicationLog>): Promise<number> {
    return this.applicationLogs.countDocuments(filter);
  }

  async countDistinctUsersAccessLogs(
    filter: Filter<AccessLog>
  ): Promise<number> {
    return this.accessLogs
      .distinct("userId", filter)
      .then((users) => users.length);
  }

  async countDistinctUsersApplicationLogs(
    filter: Filter<ApplicationLog>
  ): Promise<number> {
    return this.applicationLogs
      .distinct("userId", filter)
      .then((users) => users.length);
  }

  async queryLogsByTraceId(
    traceId: string
  ): Promise<{ accessLogs: AccessLog[]; applicationLogs: ApplicationLog[] }> {
    const accessLogs = await this.accessLogs.find({ traceId }).toArray();
    const applicationLogs = await this.applicationLogs
      .find({ traceId })
      .toArray();
    return { accessLogs, applicationLogs };
  }

  async close(): Promise<void> {
    await this.client.close();
  }

  private convertSort(sort?: Sort): any {
    if (!sort) return {};
    const mongoSort: any = {};
    for (const [field, order] of Object.entries(sort)) {
      mongoSort[field] = order === "asc" ? 1 : -1;
    }
    return mongoSort;
  }
}
