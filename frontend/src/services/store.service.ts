import api from './api'

export interface Store {
  id: string
  name: string
  cnpj?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateStoreDto {
  name: string
  cnpj?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
  }
}

export interface UpdateStoreDto {
  name?: string
  cnpj?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
  }
  isActive?: boolean
}

export const storeService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get('/admin/stores', {
      params: { page, limit },
    })
    return response.data
  },

  getById: async (id: string): Promise<Store> => {
    const response = await api.get(`/admin/stores/${id}`)
    return response.data
  },

  create: async (data: CreateStoreDto): Promise<Store> => {
    const response = await api.post('/admin/stores', data)
    return response.data
  },

  update: async (id: string, data: UpdateStoreDto): Promise<Store> => {
    const response = await api.put(`/admin/stores/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/stores/${id}`)
  },

  toggleStatus: async (id: string): Promise<Store> => {
    const response = await api.patch(`/admin/stores/${id}/toggle-status`)
    return response.data
  },
}
