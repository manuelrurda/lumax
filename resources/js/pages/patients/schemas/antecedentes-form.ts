import { Patient } from '@/types';

export type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';

export interface AntecedentesNoPatologicosForm {
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

export interface AntecedentesForm {
    antecedentes_no_patologicos: AntecedentesNoPatologicosForm;
    antecedentes_patologicos: Record<string, unknown>;
    antecedentes_heredofamiliares: Record<string, unknown>;
}

export const defaultAntecedentesNoPatologicos: AntecedentesNoPatologicosForm = {
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

export const defaultAntecedentes: AntecedentesForm = {
    antecedentes_no_patologicos: defaultAntecedentesNoPatologicos,
    antecedentes_patologicos: {},
    antecedentes_heredofamiliares: {},
};

export type PatientAntecedentesTab = Patient & {
    antecedentes?: AntecedentesForm | null;
};
