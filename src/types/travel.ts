import { Tourist } from "./tourist";

export interface Destination {
    name: string;
    city: string;
    country: string;
    description?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }
  
  export interface Travel {
    id: string;
    startDate: string;
    endDate: string;
    destination: Destination;
    touristId: string;
    tourist?: Tourist;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTravelDto {
    startDate: string;
    endDate: string;
    destination: Destination;
    touristId: string;
  }
  
  export interface UpdateTravelDto {
    startDate?: string;
    endDate?: string;
    destination?: Destination;
  }