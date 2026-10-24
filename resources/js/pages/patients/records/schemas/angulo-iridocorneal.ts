import { Patient } from '@/types';

// Empty for now — fields will be added later
export type AnguloIridocornealForm = Record<string, never>;

export const defaultAnguloIridocorneal: AnguloIridocornealForm = {};

export type PatientAnguloIridocornealTab = Patient & {
    angulo_iridocorneal?: AnguloIridocornealForm | null;
};
