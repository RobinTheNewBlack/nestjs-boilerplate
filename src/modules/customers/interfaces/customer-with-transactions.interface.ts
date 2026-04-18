import {
  CustomerTypeEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  TransactionStatusEnum,
} from '@/common/enums';

// shape ของแต่ละ SalesTransaction ที่แนบมากับ Customer
// ใช้แค่ field ที่ CustomerModule สนใจ ไม่ต้องดึง employee หรือ items มาด้วย
export interface CustomerTransaction {
  uuid: string;
  sale_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethodEnum;
  payment_status: PaymentStatusEnum;
  status: TransactionStatusEnum;
  notes: string | null;
}

// shape ที่ CustomerRepository คืนมาเมื่อ query แบบ include salesTransactions
// ใช้ใน CustomerService.getCustomerWithHistory() เท่านั้น
export interface CustomerWithTransactions {
  uuid: string;
  customer_code: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  customer_type: CustomerTypeEnum;
  is_active: boolean;
  salesTransactions: CustomerTransaction[];
}
