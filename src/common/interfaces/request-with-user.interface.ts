import { Request } from 'express';

// shape ของ payload ที่ได้หลัง decode JWT token
// JwtAuthGuard จะ decode token แล้วแนบ object นี้ไว้ที่ req.user
export interface JwtPayload {
    sub: string;    // uuid ของ user (subject)
    email: string;
    role: string;
}

// ขยาย Express Request ให้รู้จัก property ที่ NestJS middleware/guard แนบเพิ่มมา
// - correlationId : แนบโดย CorrelationIdMiddleware (correlation-id.middleware.ts)
// - user          : แนบโดย JwtAuthGuard หลัง decode token สำเร็จ (optional เพราะ route บางตัวเป็น public)
export interface RequestWithUser extends Request {
    correlationId: string;
    user?: JwtPayload;
}
