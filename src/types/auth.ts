export enum UserRole {
    EMPLOYEE = 'employee',
    TOURIST = 'tourist',
  }
  
  export interface User {
    id: string;
    username: string;
    role: UserRole;
  }
  
  export interface LoginDto {
    username: string;
    password: string;
  }
  
  export interface RegisterTouristDto {
    username: string;
    password: string;
    role: UserRole;
    nationality: string;
  }

  export interface RegisterEmployeeDto {
    
    username: string;
    password: string;
    role: UserRole;
    nationality: string;
    employeeDetails: {
        employeeId: string;
        department: string;
        contactNumber: string;
    }
  }
  
  export interface AuthResponse {
    access_token: string;
    user: User;
  }