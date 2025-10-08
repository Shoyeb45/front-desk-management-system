import { Employee, Gender } from "./adminTypes";

export enum CurrentStatusType {
    WITH_DOCTOR = "WITH_DOCTOR",
    WAITING = "WAITING",
    DONE = "DONE"
};

export enum QueueType {
    NORMAL = "NORMAL",
    EMERGENCY = "EMERGENCY"
};

export interface Patient {
    name: string;
    age: number;
    gender: Gender;
    email?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    isNewPatientNeeded?: boolean
};

export interface TQueue {
    arrivalTime: string;
    currentStatus: CurrentStatusType;
    queueType: QueueType;
    doctorId?: string | undefined;
};

export interface QueueCreate {
    queue: TQueue,
    patientId?: string,
    patient?: Patient
}

export interface QueueListType extends Omit<TQueue, "doctorId"> {
    id: string;
    createdAt: Date;
    doctor?: Employee;
    patient: Patient;
    expectedTime?: Date
}

export interface UpdateQueueData {
    currentStatus?: CurrentStatusType,
    queueType: QueueType
};

export enum AppointmentStatus {
    BOOKED = "BOOKED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    DONE = "DONE",
    NO_SHOW = "NO_SHOW",
}

export interface AppointmentCreate {
    patient: Patient,
    appointmentDate: string,
    status: AppointmentStatus,
    doctorId: string 
}

export interface TAppointment extends Omit<Omit<AppointmentCreate, "patient">, "doctorId"> {
    id: string;
    doctor: Employee;
    patient: Patient;
    createdAt: Date,
    updatedAt: Date
}
