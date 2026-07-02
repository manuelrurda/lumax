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
