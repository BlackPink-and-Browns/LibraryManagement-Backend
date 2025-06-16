export enum EmployeeRole {
  UI = 'UI',
  UX = 'UX',
  DEVELOPER = 'DEVELOPER',
  HR = 'HR',
  ADMIN = 'ADMIN',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROBATION = 'PROBATION',
}

export enum BorrowStatus {
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

export enum WaitlistStatus {
  REQUESTED = 'REQUESTED',
  NOTIFIED = 'NOTIFIED',
  REMOVED = 'REMOVED',
}

export enum NotificationType {
  BOOK_REQUEST = 'BOOK_REQUEST',
  BOOK_AVAILABLE = 'BOOK_AVAILABLE',
  BOOK_OVERDUE = 'BOOK_OVERDUE',
}