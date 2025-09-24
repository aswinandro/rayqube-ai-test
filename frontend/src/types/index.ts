export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface Upload {
  id: string
  user_id: string
  filename: string
  original_filename: string
  file_size: number
  mime_type: string
  file_url: string
  qr_code_url?: string
  s3_bucket?: string
  s3_key?: string
  upload_status: "pending" | "completed" | "failed"
  metadata?: Record<string, any>
  created_at: string
  updated_at?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: string[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password?: string
}

export interface UpdateProfileData {
  name?: string
  phone?: string
}

export interface UploadStats {
  total_uploads: string
  uploads_30d: string
  total_storage_bytes: string
  avg_file_size: string
  total_storage_mb: number
  avg_file_size_mb: number
}

export interface UserStats {
  total_users: string
  new_users_30d: string
  active_users: string
}

export interface DashboardStats {
  users: {
    total: number
    new_30d: number
    active: number
  }
  uploads: {
    total: number
    new_30d: number
    avg_size_mb: number
  }
  storage: {
    total_bytes: number
    total_mb: number
    total_gb: number
  }
}
