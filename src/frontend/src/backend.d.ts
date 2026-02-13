import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Technician {
    id: string;
    name: string;
    notes?: string;
    phone?: string;
}
export interface InventoryItem {
    id: string;
    updatedTime: bigint;
    threshold: bigint;
    name: string;
    createdTime: bigint;
    quantity: bigint;
}
export interface InventoryLog {
    id: string;
    itemId: string;
    technician: string;
    createdTime: bigint;
    ticketId: string;
    quantity: bigint;
}
export interface Feedback {
    customerName: string;
    technician?: string;
    createdTime: bigint;
    ticketId: string;
    rating: bigint;
    comments?: string;
}
export type Brand = {
    __kind__: "lg";
    lg: null;
} | {
    __kind__: "daikin";
    daikin: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "voltas";
    voltas: null;
} | {
    __kind__: "whirlpool";
    whirlpool: null;
} | {
    __kind__: "samsung";
    samsung: null;
};
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
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
    brand: Brand;
    phoneNumber: string;
    location: string;
    requestType: RequestType;
    assignedTechnician?: string;
}
export enum RequestStatus {
    assigned = "assigned",
    open = "open",
    completed = "completed",
    pendingSpares = "pendingSpares",
    enRoute = "enRoute"
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
    addInventoryItem(id: string, name: string, quantity: bigint, threshold: bigint): Promise<void>;
    addInventoryLog(ticketId: string, technician: string, itemId: string, quantity: bigint): Promise<void>;
    addTechnician(id: string, name: string, phone: string | null, notes: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignTechnician(id: string, technicianId: string): Promise<void>;
    createRequest(id: string, brand: Brand, category: string, requestType: RequestType, customerName: string, phoneNumber: string, address: string, location: string, description: string): Promise<void>;
    getAllTechnicians(): Promise<Array<Technician>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeedbackByTechnician(technician: string | null): Promise<Array<Feedback>>;
    getFilteredRequests(search: string | null, brandFilter: Brand | null, locationFilter: string | null, statusFilter: RequestStatus | null): Promise<Array<Request>>;
    getInventoryItems(): Promise<Array<InventoryItem>>;
    getInventoryLogs(): Promise<Array<InventoryLog>>;
    getLowStockItems(): Promise<Array<InventoryItem>>;
    getRequestById(id: string): Promise<Request | null>;
    getRequestsByCaller(): Promise<Array<Request>>;
    getTechnicianPerformance(): Promise<Array<[string, bigint, bigint]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitFeedback(ticketId: string, customerName: string, technician: string | null, rating: bigint, comments: string | null): Promise<void>;
    trackStatusById(id: string): Promise<Request | null>;
    trackStatusByIdAndPhone(id: string, phone: string): Promise<Request | null>;
    updateInventoryItem(id: string, quantity: bigint): Promise<void>;
}
