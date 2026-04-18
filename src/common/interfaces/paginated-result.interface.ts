// ใช้สำหรับ wrap ผลลัพธ์แบบ pagination ทุก Module
// ตัวอย่าง: CustomerService, ProductService, EmployeeService ล้วนคืน PaginatedResult<T>

export interface PaginatedResult<T> {
  data: T[];
  total: number; // จำนวน record ทั้งหมดใน DB (ก่อน paginate)
  page: number; // หน้าปัจจุบัน (เริ่มจาก 1)
  limit: number; // จำนวน record ต่อหน้า
  totalPages: number; // Math.ceil(total / limit)
}
