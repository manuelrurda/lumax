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

export interface EnfermedadPatologica {
    padece: 'sí' | 'no';
    tiempo_evolucion: string;
}

export interface AntecedentesPatologicosForm {
    diabetes: EnfermedadPatologica;
    hipertension: EnfermedadPatologica;
    enfermedades_corazon: EnfermedadPatologica;
    cancer: EnfermedadPatologica;
    epilepsia: EnfermedadPatologica;
    otros: { key: string; tiempo_evolucion: string }[];
}

export interface AntecedentesForm {
    antecedentes_no_patologicos: AntecedentesNoPatologicosForm;
    antecedentes_patologicos: AntecedentesPatologicosForm;
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

export const defaultAntecedentesPatologicos: AntecedentesPatologicosForm = {
    diabetes: { padece: 'no', tiempo_evolucion: '' },
    hipertension: { padece: 'no', tiempo_evolucion: '' },
    enfermedades_corazon: { padece: 'no', tiempo_evolucion: '' },
    cancer: { padece: 'no', tiempo_evolucion: '' },
    epilepsia: { padece: 'no', tiempo_evolucion: '' },
    otros: [],
};

export const defaultAntecedentes: AntecedentesForm = {
    antecedentes_no_patologicos: defaultAntecedentesNoPatologicos,
    antecedentes_patologicos: defaultAntecedentesPatologicos,
    antecedentes_heredofamiliares: {},
};

export type PatientAntecedentesTab = Patient & {
    antecedentes?: AntecedentesForm | null;
};
