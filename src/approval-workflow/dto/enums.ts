// 审批工作流领域枚举与常量（与前端 domain/types.ts / applicationTypes.ts 完全一致）。
// 注意：Prisma 在 MySQL 不支持原生 enum，库内以 String 存储，此处用 TS 字面量元组约束。

export const APPLICATION_TYPES = ['travel', 'leave'] as const;
export type ApplicationType = (typeof APPLICATION_TYPES)[number];

export const REQUEST_STATUSES = [
  'draft',
  'pending_manager',
  'pending_finance',
  'approved',
  'rejected',
  'cancelled',
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const AUDIT_ACTIONS = [
  'submit',
  'approve',
  'reject',
  'cancel',
  'reedit',
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const ROLES = ['employee', 'manager', 'finance'] as const;
export type Role = (typeof ROLES)[number];

export const URGENCIES = ['normal', 'urgent'] as const;
export type Urgency = (typeof URGENCIES)[number];

export const TRANSPORTS = ['train', 'flight', 'car', 'other'] as const;
export type Transport = (typeof TRANSPORTS)[number];

export const LEAVE_TYPES = ['annual', 'sick', 'personal'] as const;
export type LeaveType = (typeof LEAVE_TYPES)[number];

// 校验常量（对齐前端 applicationTypes.ts / workflow.ts）
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_LEGS = 10;
export const REASON_MIN_TRAVEL = 10; // 差旅事由 10~200
export const REASON_MIN_LEAVE = 5; // 请假事由 5~200（已与用户确认取 5）
export const REASON_MAX = 200;
export const CENTS_MAX = 1_000_000_000; // 单字段金额上限 1e9 分
export const BUDGET_NOTE_THRESHOLD_CENTS = 1_000_000; // 预算合计 > 1 万元需填说明
export const COMMENT_MAX = 200; // reject 意见 / 通用意见上限（对齐前端 REJECT_COMMENT_MAX_LENGTH）
export const NOTE_MAX = 200; // budgetNote / 请假 note 上限
export const PENDING_STATUSES: RequestStatus[] = [
  'pending_manager',
  'pending_finance',
];
