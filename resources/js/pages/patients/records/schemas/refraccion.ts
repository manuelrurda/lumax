import { Patient } from '@/types';

export interface RefraccionForm {
    // Agudeza Visual - Ojo Derecho (OD)
    od_av_sin_opt1: string;
    od_av_sin_opt2: string;
    od_av_sin_input: string;
    od_av_con_opt1: string;
    od_av_con_opt2: string;
    od_av_con_input: string;

    // Measurements - Ojo Derecho (OD)
    od_quera_1: string;
    od_quera_2: string;
    od_quera_3: string;
    od_retino_1: string;
    od_retino_2: string;
    od_retino_3: string;
    od_retino_4: string;
    od_refrac_1: string;
    od_refrac_2: string;
    od_refrac_3: string;
    od_refrac_4: string;
    od_ciclo_1: string;
    od_ciclo_2: string;
    od_ciclo_3: string;
    od_ciclo_4: string;

    // OD (Ojo Derecho) - Adición and Distancia
    od_adicion: string;
    od_distancia: string;

    // Agudeza Visual - Ojo Izquierdo (OI)
    oi_av_sin_opt1: string;
    oi_av_sin_opt2: string;
    oi_av_sin_input: string;
    oi_av_con_opt1: string;
    oi_av_con_opt2: string;
    oi_av_con_input: string;

    // Measurements - Ojo Izquierdo (OI)
    oi_quera_1: string;
    oi_quera_2: string;
    oi_quera_3: string;
    oi_retino_1: string;
    oi_retino_2: string;
    oi_retino_3: string;
    oi_retino_4: string;
    oi_refrac_1: string;
    oi_refrac_2: string;
    oi_refrac_3: string;
    oi_refrac_4: string;
    oi_ciclo_1: string;
    oi_ciclo_2: string;
    oi_ciclo_3: string;
    oi_ciclo_4: string;

    // OI (Ojo Izquierdo) - Adición and Distancia
    oi_adicion: string;
    oi_distancia: string;

    // General Comentarios
    comentarios: string;
}

export const defaultRefraccion: RefraccionForm = {
    // OD
    od_av_sin_opt1: '',
    od_av_sin_opt2: '',
    od_av_sin_input: '',
    od_av_con_opt1: '',
    od_av_con_opt2: '',
    od_av_con_input: '',

    od_quera_1: '', od_quera_2: '', od_quera_3: '',
    od_retino_1: '', od_retino_2: '', od_retino_3: '', od_retino_4: '',
    od_refrac_1: '', od_refrac_2: '', od_refrac_3: '', od_refrac_4: '',
    od_ciclo_1: '', od_ciclo_2: '', od_ciclo_3: '', od_ciclo_4: '',

    od_adicion: '',
    od_distancia: '',

    // OI
    oi_av_sin_opt1: '',
    oi_av_sin_opt2: '',
    oi_av_sin_input: '',
    oi_av_con_opt1: '',
    oi_av_con_opt2: '',
    oi_av_con_input: '',

    oi_quera_1: '', oi_quera_2: '', oi_quera_3: '',
    oi_retino_1: '', oi_retino_2: '', oi_retino_3: '', oi_retino_4: '',
    oi_refrac_1: '', oi_refrac_2: '', oi_refrac_3: '', oi_refrac_4: '',
    oi_ciclo_1: '', oi_ciclo_2: '', oi_ciclo_3: '', oi_ciclo_4: '',

    oi_adicion: '',
    oi_distancia: '',

    comentarios: '',
};

export type PatientRefraccionTab = Patient & {
    refraccion?: RefraccionForm | null;
};

export const agudezaVisualUnits: Record<string, { label: string; values: string[] }> = {
    decimal: {
        label: 'Decimal',
        values: ['0,10', '0,12', '0,16', '0,20', '0,25', '0,32', '0,40', '0,50', '0,63', '0,80', '1,00', '1,25'],
    },
    fraccion: {
        label: 'Fracción',
        values: ['1/10', '1/8', '4/25', '1/5', '1/4', '1/3', '2/5', '1/2', '2/3,2', '4/5', '1/1', '5/4'],
    },
    snellen_6m: {
        label: 'Snellen (6 m)',
        values: ['6/60', '6/48', '6/37,5', '6/30', '6/24', '6/19', '6/15', '6/12', '6/9,5', '6/7,5', '6/6', '6/4,8'],
    },
    snellen_20ft: {
        label: 'Snellen (20 pies)',
        values: ['20/200', '20/160', '20/125', '20/100', '20/80', '20/63', '20/50', '20/40', '20/32', '20/25', '20/20', '20/16'],
    },
    logmar: {
        label: 'logMAR',
        values: ['1,0', '0,9', '0,8', '0,7', '0,6', '0,5', '0,4', '0,3', '0,2', '0,1', '0,0', '-0,1'],
    },
};
