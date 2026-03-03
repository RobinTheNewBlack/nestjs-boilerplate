import { CustomerTypeEnum } from '@/common/enums';

// shape ที่ใช้ใน list view — ดึงแค่ field ที่จำเป็น ไม่ต้องดึง address หรือ postal_code
// CustomerRepository.findSummaries() จะ map Prisma result ให้ตรงกับ interface นี้ก่อน return
export interface CustomerSummary {
    uuid: string;
    customer_code: string;
    full_name: string;           // first_name + ' ' + last_name (computed ใน repository)
    email: string | null;
    customer_type: CustomerTypeEnum;
    is_active: boolean;
    total_transactions: number;  // count ของ salesTransactions (aggregated ใน query)
}
