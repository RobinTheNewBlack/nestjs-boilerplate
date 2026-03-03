export const ERROR_MESSAGES = {
  CUSTOMER: {
    NOT_FOUND: (id: string) => `Customer not found with ID: ${id}`,
    NAME_REQUIRED: 'First name and last name cannot be empty',
  },
  EMPLOYEE: {
    NOT_FOUND: (id: string) => `Employee not found with ID: ${id}`,
  },
  INVENTORY: {
    NOT_FOUND: (id: string) => `Inventory not found with ID: ${id}`,
    ALREADY_EXISTS: 'Inventory already exists',
    INSUFFICIENT_STOCK: 'Insufficient stock available',
  },
  PRODUCT: {
    NOT_FOUND: (id: string) => `Product not found with ID: ${id}`,
  },
  SALES_TRANSACTION: {
    NOT_FOUND: (id: string) => `Sales transaction not found with ID: ${id}`,
  },
  SALES_TRANSACTION_ITEM: {
    NOT_FOUND: (id: string) => `Sales transaction item not found with ID: ${id}`,
  },
  USER: {
    NOT_FOUND: (id: string) => `User not found with ID: ${id}`,
    EMAIL_TAKEN: 'Email is already taken',
    INVALID_CREDENTIALS: 'Invalid email or password',
  },
  AUTH: {
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
  },
} as const;
