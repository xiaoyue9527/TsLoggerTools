"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLSLogSyncer = exports.MongoDBLogSyncer = exports.LogSyncer = void 0;
const LogSyncer_1 = require("./base/LogSyncer");
Object.defineProperty(exports, "LogSyncer", { enumerable: true, get: function () { return LogSyncer_1.LogSyncer; } });
const mongodb_1 = require("./syncer/mongodb");
Object.defineProperty(exports, "MongoDBLogSyncer", { enumerable: true, get: function () { return mongodb_1.MongoDBLogSyncer; } });
const sls_1 = require("./syncer/sls");
Object.defineProperty(exports, "SLSLogSyncer", { enumerable: true, get: function () { return sls_1.SLSLogSyncer; } });
