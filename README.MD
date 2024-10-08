# ts-logger-tools

`ts-logger-tools` 是一个基于 TypeScript 的日志工具包，旨在为 Node.js 应用程序提供强大的日志记录和管理功能。它支持多种日志类型，包括访问日志、应用日志，并且可以与 MongoDB 集成，用于日志的存储和查询。

## 特性

- **TypeScript 支持**：使用 TypeScript 编写，提供类型安全和良好的开发体验。
- **多种日志类型**：支持访问日志和应用日志。
- **MongoDB 集成**：日志可以存储在 MongoDB 中，方便查询和分析。
- **单元测试**：使用 Jest 进行单元测试，确保代码质量。

## 安装

使用 npm 安装：

```bash
npm install ts-logger-tools
```

或使用 yarn 安装：

```bash
yarn add ts-logger-tools
```

## 使用方法

### 初始化

首先，初始化日志工具：

```typescript
import { Logger, MongoDBSync } from 'ts-logger-tools';

// 初始化 MongoDB 同步器
const mongoSync = new MongoDBSync({
  uri: 'mongodb://localhost:27017',
  dbName: 'logs',
});

// 初始化 Logger
const logger = new Logger({
  sync: mongoSync,
  level: 'info',
});
```

### 记录日志

记录访问日志：

```typescript
logger.access({
  method: 'GET',
  url: '/api/v1/resource',
  status: 200,
  responseTime: 123,
});
```

记录应用日志：

```typescript
logger.info('This is an info message');
logger.error('This is an error message');
```

### 查询日志

从 MongoDB 中查询日志：

```typescript
const logs = await mongoSync.queryLogs({
  level: 'info',
  startTime: new Date('2023-01-01'),
  endTime: new Date('2023-12-31'),
});
console.log(logs);
```

## 脚本

- `npm run test`：运行单元测试。
- `npm run coverage`：生成测试覆盖率报告。
- `npm run build`：构建项目。
- `npm run tree`：生成项目结构树。
- `npm run lint`：运行 ESLint 检查代码。
- `npm run push`：提交并推送代码到 Git 仓库。
- `npm run rele`：运行发布脚本。

## 贡献

欢迎贡献代码！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

## 许可证

[MIT](LICENSE)

## 作者

[xiaoyue9527](https://github.com/xiaoyue9527)

