import { Patient } from '@/types';

export interface ExploracionFisicaForm {
    frecuencia_cardiaca: string;
    frecuencia_respiratoria: string;
    presion_arterial: string;
    temperatura: string;
    padecimiento_actual: string;
}

export const defaultExploracionFisica: ExploracionFisicaForm = {
    frecuencia_cardiaca: '80 lpm',
    frecuencia_respiratoria: '18 rpm',
    presion_arterial: '120/80 mmHg',
    temperatura: '36.0 °C',
    padecimiento_actual:
        'Paciente despierto, orientado, cooperador, mucosas con adecuado estado de hidratación, cuello cilíndrico sin ingurgitación yugular, tórax con forma de cono tronco invertido, movimientos de amplexión y amplexación normales, ruidos respiratorios normales, ruidos cardíacos rítmicos, adecuados en tono, intensidad y frecuencia; abdomen blando, depresible, sin irritación peritoneal. Extremidades eutróficas, llenado capilar 2”.',
};

export type PatientExploracionFisicaTab = Patient & {
    exploracion_fisica?: ExploracionFisicaForm | null;
};
