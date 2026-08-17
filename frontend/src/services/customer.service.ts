import api from './api'

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  document?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerDto {
  name: string
  email: string
  phone?: string
  document?: string
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

export interface UpdateCustomerDto {
  name?: string
  email?: string
  phone?: string
  document?: string
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

export const customerService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get('/admin/customers', {
      params: { page, limit },
    })
    return response.data
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/admin/customers/${id}`)
    return response.data
  },

  create: async (data: CreateCustomerDto): Promise<Customer> => {
    const response = await api.post('/admin/customers', data)
    return response.data
  },

  update: async (id: string, data: UpdateCustomerDto): Promise<Customer> => {
    const response = await api.put(`/admin/customers/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/customers/${id}`)
  },
}
