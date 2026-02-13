import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Request {
    id: string;
    customerName: string;
    status: RequestStatus;
    updatedTime: bigint;
    user: Principal;
    description: string;
    createdTime: bigint;
    address: string;
    sparesUsed?: string;
    category: string;
    phoneNumber: string;
    requestType: RequestType;
    assignedTechnician?: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export enum RequestStatus {
    closed = "closed",
    open = "open"
}
export enum RequestType {
    service = "service",
    spares = "spares"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminUpdateRequest(id: string, status: RequestStatus | null, technician: string | null, spares: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTechnician(id: string, technician: string): Promise<void>;
    createRequest(id: string, category: string, requestType: RequestType, customerName: string, phoneNumber: string, address: string, description: string): Promise<void>;
    getAllRequests(): Promise<Array<Request>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRequestById(id: string): Promise<Request | null>;
    getRequestsByCaller(): Promise<Array<Request>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateRequestStatus(id: string, status: RequestStatus): Promise<void>;
    updateSparesUsed(id: string, spares: string): Promise<void>;
}
