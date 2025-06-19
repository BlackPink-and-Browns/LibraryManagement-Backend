export enum EmployeeRole {
    UI = "UI",
    UX = "UX",
    DEVELOPER = "DEVELOPER",
    HR = "HR",
    ADMIN = "ADMIN",
}

export enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PROBATION = "PROBATION",
}

export enum BorrowStatus {
    BORROWED = "BORROWED",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE",
}

export enum WaitlistStatus {
  REQUESTED = 'REQUESTED',
  NOTIFIED = 'NOTIFIED',
  REMOVED = 'REMOVED',
  FULFILLED='FULFILLED'
}

export enum NotificationType {
    BOOK_REQUEST = "BOOK_REQUEST",
    BOOK_AVAILABLE = "BOOK_AVAILABLE",
    BOOK_OVERDUE = "BOOK_OVERDUE",
}

export enum AuditLogType {
    UPDATE = "UPDATE",
    CREATE = "CREATE",
    DELETE = "DELETE",
}

export enum EntityType {
    BOOK = "BOOK",
	EMPLOYEE = "EMPLOYEE",
	AUTHOR = "AUTHOR",
	BOOK_COPY = "BOOK COPY",
	BORROW_RECORD = "BORROW RECORD",
	DEPARTMENT = "DEPARTMENT",
	GENRE = "GENRE",
	NOTIFICATION = "NOTIFICATION",
	REVIEW = "REVIEW",
	SHELF = "SHELF",
	WAITLIST = "WAITLIST",
	ADDRESS = "ADDRESS"
}
