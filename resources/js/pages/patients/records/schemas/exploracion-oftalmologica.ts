import { Patient } from '@/types';

export interface ExploracionOftalmologicaForm {
    // Empty for now — fields will be added later
}

export const defaultExploracionOftalmologica: ExploracionOftalmologicaForm = {};

export type PatientExploracionOftalmologicaTab = Patient & {
    exploracion_oftalmologica?: ExploracionOftalmologicaForm | null;
};
