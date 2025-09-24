import { useMutation, useQuery, useQueryClient } from "react-query"
import api from "@/lib/api"
import type { Upload, PaginatedResponse, UploadStats } from "@/types"
import { toast } from "react-hot-toast"

export const useUploads = () => {
  const queryClient = useQueryClient()

  const uploadFileMutation = useMutation<{ upload: Upload }, Error, FormData>(
    async (formData) => {
      const response = await api.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("my-uploads")
        queryClient.invalidateQueries("upload-stats")
        toast.success("File uploaded successfully!")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Upload failed")
      },
    },
  )

  const deleteUploadMutation = useMutation<void, Error, string>(
    async (uploadId) => {
      await api.delete(`/api/upload/${uploadId}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("my-uploads")
        queryClient.invalidateQueries("upload-stats")
        toast.success("File deleted successfully!")
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Delete failed")
      },
    },
  )

  const getMyUploadsQuery = useQuery<PaginatedResponse<Upload>, Error>(["my-uploads", 1, 20], async () => {
    const response = await api.get("/api/upload/my-uploads?page=1&limit=20")
    return response.data
  })

  const getUploadStatsQuery = useQuery<{ stats: UploadStats }, Error>("upload-stats", async () => {
    const response = await api.get("/api/upload/stats")
    return response.data
  })

  const getDownloadUrl = async (uploadId: string, expires = 3600) => {
    try {
      const response = await api.get(`/api/upload/${uploadId}/download?expires=${expires}`)
      return response.data.downloadUrl
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate download URL")
      throw error
    }
  }

  const getMyUploads = (page = 1, limit = 20) => {
    return getMyUploadsQuery
  }

  const getUploadStats = () => {
    return getUploadStatsQuery
  }

  return {
    uploadFile: uploadFileMutation.mutate,
    deleteUpload: deleteUploadMutation.mutate,
    getMyUploads,
    getUploadStats,
    getDownloadUrl,
    isUploading: uploadFileMutation.isLoading,
    isDeleting: deleteUploadMutation.isLoading,
  }
}
