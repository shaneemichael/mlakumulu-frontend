import { Travel, CreateTravelDto, UpdateTravelDto } from '../types/travel';
import api from '../lib/api';

export const travelService = {
  getMyTravels: async (): Promise<Travel[]> => {
    const response = await api.get<Travel[]>('/travels/my-travels');
    return response.data;
  },

  getAllTravels: async (): Promise<Travel[]> => {
    const response = await api.get<Travel[]>('/travels');
    return response.data;
  },

  getTravel: async (id: string): Promise<Travel> => {
    const response = await api.get<Travel>(`/travels/${id}`);
    return response.data;
  },

  createTravel: async (data: CreateTravelDto): Promise<Travel> => {
    const response = await api.post<Travel>('/travels', data);
    return response.data;
  },

  updateTravel: async (id: string, data: UpdateTravelDto): Promise<Travel> => {
    const response = await api.patch<Travel>(`/travels/${id}`, data);
    return response.data;
  },

  deleteTravel: async (id: string): Promise<void> => {
    await api.delete(`/travels/${id}`);
  }
};