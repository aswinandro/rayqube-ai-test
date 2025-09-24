import { useMutation, useQuery } from "react-query"
import { useAuthStore } from "@/store/auth"
import api from "@/lib/api"
import type { AuthResponse, LoginCredentials, RegisterData, UpdateProfileData, User } from "@/types"
import { toast } from "react-hot-toast"

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout, updateUser } = useAuthStore()

  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>(
    async (credentials) => {
      const response = await api.post("/api/auth/login", credentials)
      return response.data
    },
    {
      onSuccess: (data) => {
        setAuth(data.user, data.token)
        toast.success("Login successful!")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Login failed")
      },
    },
  )

  const registerMutation = useMutation<AuthResponse, Error, RegisterData>(
    async (userData) => {
      const response = await api.post("/api/auth/register", userData)
      return response.data
    },
    {
      onSuccess: (data) => {
        setAuth(data.user, data.token)
        toast.success("Registration successful!")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Registration failed")
      },
    },
  )

  const updateProfileMutation = useMutation<{ user: User }, Error, UpdateProfileData>(
    async (userData) => {
      const response = await api.put("/api/auth/update-profile", userData)
      return response.data
    },
    {
      onSuccess: (data) => {
        updateUser(data.user)
        toast.success("Profile updated successfully!")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Update failed")
      },
    },
  )

  const { data: currentUser, refetch: refetchUser } = useQuery<User>(
    "current-user",
    async () => {
      const response = await api.get("/api/auth/me")
      return response.data.user
    },
    {
      enabled: isAuthenticated && !!token,
      onSuccess: (data) => {
        updateUser(data)
      },
      onError: () => {
        logout()
      },
    },
  )

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  return {
    user: user || currentUser,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    logout: handleLogout,
    refetchUser,
    isLoading: loginMutation.isLoading || registerMutation.isLoading || updateProfileMutation.isLoading,
  }
}
