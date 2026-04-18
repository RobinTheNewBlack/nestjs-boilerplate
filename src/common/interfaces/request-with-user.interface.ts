import { Request } from 'express';

// shape ของ user object ที่ JwtStrategy.validate() return และถูกเก็บไว้ที่ req.user
export interface JwtPayload {
  sub: string; // uuid ของ user (subject)
  email: string;
  username: string; // preferred_username จาก Keycloak JWT payload
  roles: string[]; // realm_access.roles จาก Keycloak JWT payload
}

// ขยาย Express Request ให้รู้จัก property ที่ NestJS middleware/guard แนบเพิ่มมา
// - correlationId : แนบโดย CorrelationIdMiddleware (correlation-id.middleware.ts)
// - user          : แนบโดย JwtAuthGuard หลัง decode token สำเร็จ (optional เพราะ route บางตัวเป็น public)
export interface RequestWithUser extends Request {
  correlationId: string;
  user?: JwtPayload;
}
