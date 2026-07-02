import { Patient } from '@/types';

export interface RefraccionForm {
    // OD (Ojo Derecho) - Sin corrección
    od_sin_quera_1: string;
    od_sin_quera_2: string;
    od_sin_quera_3: string;
    od_sin_retino_1: string;
    od_sin_retino_2: string;
    od_sin_retino_3: string;
    od_sin_retino_4: string;
    od_sin_refrac_1: string;
    od_sin_refrac_2: string;
    od_sin_refrac_3: string;
    od_sin_refrac_4: string;
    od_sin_ciclo_1: string;
    od_sin_ciclo_2: string;
    od_sin_ciclo_3: string;
    od_sin_ciclo_4: string;

    // OD (Ojo Derecho) - Con corrección
    od_con_quera_1: string;
    od_con_quera_2: string;
    od_con_quera_3: string;
    od_con_retino_1: string;
    od_con_retino_2: string;
    od_con_retino_3: string;
    od_con_retino_4: string;
    od_con_refrac_1: string;
    od_con_refrac_2: string;
    od_con_refrac_3: string;
    od_con_refrac_4: string;
    od_con_ciclo_1: string;
    od_con_ciclo_2: string;
    od_con_ciclo_3: string;
    od_con_ciclo_4: string;

    // OD (Ojo Derecho) - Adición and Distancia
    od_adicion: string;
    od_distancia: string;

    // OI (Ojo Izquierdo) - Sin corrección
    oi_sin_quera_1: string;
    oi_sin_quera_2: string;
    oi_sin_quera_3: string;
    oi_sin_retino_1: string;
    oi_sin_retino_2: string;
    oi_sin_retino_3: string;
    oi_sin_retino_4: string;
    oi_sin_refrac_1: string;
    oi_sin_refrac_2: string;
    oi_sin_refrac_3: string;
    oi_sin_refrac_4: string;
    oi_sin_ciclo_1: string;
    oi_sin_ciclo_2: string;
    oi_sin_ciclo_3: string;
    oi_sin_ciclo_4: string;

    // OI (Ojo Izquierdo) - Con corrección
    oi_con_quera_1: string;
    oi_con_quera_2: string;
    oi_con_quera_3: string;
    oi_con_retino_1: string;
    oi_con_retino_2: string;
    oi_con_retino_3: string;
    oi_con_retino_4: string;
    oi_con_refrac_1: string;
    oi_con_refrac_2: string;
    oi_con_refrac_3: string;
    oi_con_refrac_4: string;
    oi_con_ciclo_1: string;
    oi_con_ciclo_2: string;
    oi_con_ciclo_3: string;
    oi_con_ciclo_4: string;

    // OI (Ojo Izquierdo) - Adición and Distancia
    oi_adicion: string;
    oi_distancia: string;

    // General Comentarios
    comentarios: string;
}

export const defaultRefraccion: RefraccionForm = {
    od_sin_quera_1: '', od_sin_quera_2: '', od_sin_quera_3: '',
    od_sin_retino_1: '', od_sin_retino_2: '', od_sin_retino_3: '', od_sin_retino_4: '',
    od_sin_refrac_1: '', od_sin_refrac_2: '', od_sin_refrac_3: '', od_sin_refrac_4: '',
    od_sin_ciclo_1: '', od_sin_ciclo_2: '', od_sin_ciclo_3: '', od_sin_ciclo_4: '',
    
    od_con_quera_1: '', od_con_quera_2: '', od_con_quera_3: '',
    od_con_retino_1: '', od_con_retino_2: '', od_con_retino_3: '', od_con_retino_4: '',
    od_con_refrac_1: '', od_con_refrac_2: '', od_con_refrac_3: '', od_con_refrac_4: '',
    od_con_ciclo_1: '', od_con_ciclo_2: '', od_con_ciclo_3: '', od_con_ciclo_4: '',

    od_adicion: '', od_distancia: '',

    oi_sin_quera_1: '', oi_sin_quera_2: '', oi_sin_quera_3: '',
    oi_sin_retino_1: '', oi_sin_retino_2: '', oi_sin_retino_3: '', oi_sin_retino_4: '',
    oi_sin_refrac_1: '', oi_sin_refrac_2: '', oi_sin_refrac_3: '', oi_sin_refrac_4: '',
    oi_sin_ciclo_1: '', oi_sin_ciclo_2: '', oi_sin_ciclo_3: '', oi_sin_ciclo_4: '',
    
    oi_con_quera_1: '', oi_con_quera_2: '', oi_con_quera_3: '',
    oi_con_retino_1: '', oi_con_retino_2: '', oi_con_retino_3: '', oi_con_retino_4: '',
    oi_con_refrac_1: '', oi_con_refrac_2: '', oi_con_refrac_3: '', oi_con_refrac_4: '',
    oi_con_ciclo_1: '', oi_con_ciclo_2: '', oi_con_ciclo_3: '', oi_con_ciclo_4: '',

    oi_adicion: '', oi_distancia: '',

    comentarios: '',
};

export type PatientRefraccionTab = Patient & {
    refraccion?: RefraccionForm | null;
};
