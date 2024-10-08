// src/base/index.ts

type SortOrder = "asc" | "desc";

export interface Sort {
  [field: string]: SortOrder;
}

export interface Log {
  traceId: string; // 追踪 ID
  timestamp: number; // 时间戳
  level: string; // 日志级别
  message: string; // 日志消息
  logType: "entry" | "exit"; // 日志类型（进入或退出）
  [key: string]: any; // 其他字段
}

// 访问日志类型
export interface AccessLog extends Log {
  requestTime: number; // 请求时间
  ipAddress: string; // IP 地址
  requestUrl: string; // 请求 URL
  httpMethod: string; // HTTP 方法
  statusCode: number; // HTTP 状态码
  userAgent: string; // 用户代理
  responseTime: number; // 响应时间
  userId?: string; // 用户 ID（可选）
  string?: string; // 用户角色（可选）
}

// 应用日志类型
export interface ApplicationLog extends Log {
  action: string; // 具体操作
  userId?: string; // 用户 ID（可选）
  details: any; // 详细信息
  eventType: "login" | "security" | "trace" | "operation"; // 事件类型
  loginResult?: "success" | "failure"; // 登录结果（仅用于登录事件）
  failureReason?: string; // 失败原因
  spanId?: string; // Span ID（仅用于追踪）
  parentSpanId?: string; // 父 Span ID（仅用于追踪）
  service?: string; // 服务名称（仅用于追踪）
  operation?: string; // 操作名称（仅用于追踪）
  duration?: number; // 操作持续时间（仅用于追踪）
  error?: boolean; // 是否有错误（仅用于追踪）
}
