import { Travel } from "./travel";

export interface Tourist {
    id: string;
    name: string;
    nationality: string;
    passportNumber?: string;
    phoneNumber?: string;
    email?: string;
    userId: string;
    travels?: Travel[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTouristDto {
    name: string;
    nationality: string;
    passportNumber?: string;
    phoneNumber?: string;
    email?: string;
    userId: string;
  }
  
  export interface UpdateTouristDto {
    name?: string;
    nationality?: string;
    passportNumber?: string;
    phoneNumber?: string;
    email?: string;
  }
  