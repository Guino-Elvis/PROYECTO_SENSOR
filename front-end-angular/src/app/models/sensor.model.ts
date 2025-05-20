import { Lectura } from "./lectura.model";

export interface Sensor {
    id?: number;
    nombre?: string;
    tipo?: string;
    estado?: string;
    lectura?: Lectura[];
    created_at?: string | null;
    updated_at?: string | null;
}