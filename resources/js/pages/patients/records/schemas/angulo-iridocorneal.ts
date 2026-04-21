import { Patient } from '@/types';

export interface AnguloIridocornealForm {
    // Empty for now — fields will be added later
}

export const defaultAnguloIridocorneal: AnguloIridocornealForm = {};

export type PatientAnguloIridocornealTab = Patient & {
    angulo_iridocorneal?: AnguloIridocornealForm | null;
};
