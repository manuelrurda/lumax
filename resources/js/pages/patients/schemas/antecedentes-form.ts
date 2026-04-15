import { Patient } from '@/types';

export type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';

export interface AntecedentesForm {
    ocupacion: string;
    religion: string;
    tipo_sangre: TipoSangre;
    fuma: string;
    toma: string;
    transfusiones: string;
    psicotropicos: string;
    alergias: string;
    perinatales: string;
    otros: { key: string; value: string }[];
}

export const defaultAntecedentes: AntecedentesForm = {
    ocupacion: 'Ninguna',
    religion: 'Ninguna',
    tipo_sangre: '',
    fuma: 'no',
    toma: 'no',
    transfusiones: 'no',
    psicotropicos: 'Ninguno',
    alergias: 'Ninguna',
    perinatales: 'Ninguno',
    otros: [],
};

export type PatientAntecedentesTab = Patient & {
    antecedentes?: AntecedentesForm | null;
};
