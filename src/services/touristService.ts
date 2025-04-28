import { Tourist, CreateTouristDto, UpdateTouristDto } from '../types/tourist';
import api from '../lib/api';

export const touristService = {
  getProfile: async (): Promise<Tourist> => {
    const response = await api.get<Tourist>('/tourists/profile');
    return response.data;
  },

  getAllTourists: async (): Promise<Tourist[]> => {
    const response = await api.get<Tourist[]>('/tourists');
    return response.data;
  },

  getTourist: async (id: string): Promise<Tourist> => {
    const response = await api.get<Tourist>(`/tourists/${id}`);
    return response.data;
  },

  createTourist: async (data: CreateTouristDto): Promise<Tourist> => {
    const response = await api.post<Tourist>('/tourists', data);
    return response.data;
  },

  updateTourist: async (id: string, data: UpdateTouristDto): Promise<Tourist> => {
    const response = await api.patch<Tourist>(`/tourists/${id}`, data);
    return response.data;
  },

  deleteTourist: async (id: string): Promise<void> => {
    await api.delete(`/tourists/${id}`);
  }
};