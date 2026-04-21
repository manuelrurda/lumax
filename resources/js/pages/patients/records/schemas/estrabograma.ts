import { Patient } from '@/types';

export interface EstrabogramaForm {
    // Numbered inputs matching diagram positions (top-to-bottom, left-to-right per group)
    campo_1: string;  // Top-left box, input 1
    campo_2: string;  // Top-left box, input 2
    campo_3: string;  // Top-right box, input 1
    campo_4: string;  // Top-right box, input 2
    campo_5: string;  // Top of left triangle, pos 1
    campo_6: string;  // Top of left triangle, pos 2
    campo_7: string;  // Top of left triangle, pos 3
    campo_8: string;  // Top of right triangle, pos 1
    campo_9: string;  // Top of right triangle, pos 2
    campo_10: string; // Top of right triangle, pos 3
    campo_11: string; // Middle of left triangle, pos 1
    campo_12: string; // Middle of left triangle, pos 2
    campo_13: string; // Middle of left triangle, pos 3
    campo_14: string; // Middle of right triangle, pos 1
    campo_15: string; // Middle of right triangle, pos 2
    campo_16: string; // Middle of right triangle, pos 3
    campo_17: string; // Bottom of left triangle, pos 1
    campo_18: string; // Bottom of left triangle, pos 2
    campo_19: string; // Bottom of left triangle, pos 3
    campo_20: string; // Bottom of right triangle, pos 1
    campo_21: string; // Bottom of right triangle, pos 2
    campo_22: string; // Bottom of right triangle, pos 3
    campo_23: string; // Wide input between triangles, top
    campo_24: string; // Wide input between triangles, bottom
    campo_25: string; // Wide input outside left triangle
    campo_26: string; // Wide input outside right triangle
    observaciones: string;
}

export const defaultEstrabograma: EstrabogramaForm = {
    campo_1: '', campo_2: '', campo_3: '', campo_4: '',
    campo_5: '', campo_6: '', campo_7: '',
    campo_8: '', campo_9: '', campo_10: '',
    campo_11: '', campo_12: '', campo_13: '',
    campo_14: '', campo_15: '', campo_16: '',
    campo_17: '', campo_18: '', campo_19: '',
    campo_20: '', campo_21: '', campo_22: '',
    campo_23: '', campo_24: '',
    campo_25: '', campo_26: '',
    observaciones: '',
};

export type PatientEstrabogramaTab = Patient & {
    estrabograma?: EstrabogramaForm | null;
};
