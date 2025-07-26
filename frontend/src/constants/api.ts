// API base URL
export const API_BASE_URL = 'http://localhost/shop-app/backend-php/index.php/api';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    // PHP không có refresh, me
  },
  CATEGORY: {
    GET_ALL: `${API_BASE_URL}/categories`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/categories/${id}`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id: number) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/categories/${id}`
  },
  PRODUCT: {
    GET_ALL: `${API_BASE_URL}/products`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/products/${id}`,
    GET_BY_CATEGORY: (categoryId: number) => `${API_BASE_URL}/products?categoryId=${categoryId}`,
    SEARCH: `${API_BASE_URL}/products/search`, // cần chỉnh lại nếu PHP có hỗ trợ
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: (id: number) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/products/${id}`
  },
  ORDER: {
    CREATE: `${API_BASE_URL}/orders`,
    GET_MY_ORDERS: `${API_BASE_URL}/orders?customerId=ME`, // sẽ thay thế ME bằng id thực tế
    GET_BY_ID: (id: number) => `${API_BASE_URL}/orders/${id}`,
    GET_ALL: `${API_BASE_URL}/orders`,
    UPDATE_STATUS: (id: number) => `${API_BASE_URL}/orders/${id}`
  },
  USER: {
    GET_PROFILE: `${API_BASE_URL}/users/ME`, // sẽ thay thế ME bằng id thực tế
    UPDATE_PROFILE: `${API_BASE_URL}/users/ME`, // sẽ thay thế ME bằng id thực tế
    CHANGE_PASSWORD: `${API_BASE_URL}/users/ME/change-password` // sẽ thay thế ME bằng id thực tế
  },
  ADMIN: {
    DASHBOARD_SUMMARY: `${API_BASE_URL}/admin/dashboard`,
    USERS: {
      GET_ALL_CUSTOMERS: `${API_BASE_URL}/admin/users/customers`,
      GET_ALL_STAFF: `${API_BASE_URL}/admin/users/staff`,
      GET_BY_ID: (id: number) => `${API_BASE_URL}/admin/users/${id}`,
      CREATE: `${API_BASE_URL}/admin/users`,
      UPDATE: (id: number) => `${API_BASE_URL}/admin/users/${id}`
    },
    ORDERS: {
      GET_ALL: `${API_BASE_URL}/admin/orders`,
      GET_BY_ID: (id: number) => `${API_BASE_URL}/admin/orders/${id}`,
      UPDATE_STATUS: (id: number) => `${API_BASE_URL}/admin/orders/${id}`
    }
  },
  UPLOAD: {
    SINGLE: `${API_BASE_URL}/upload`,
    MULTIPLE: `${API_BASE_URL}/upload/multiple`
  }
};
