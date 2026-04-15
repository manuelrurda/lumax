export interface AntecedentesOftalmologicosForm {
    lentes_aereos: {
        ultima_refraccion: string;
        gotas: string;
        cirugias_previas: string;
        glaucoma: string;
    };
    lentes_contacto: {
        blandos: boolean;
        rigidos: boolean;
        ultima_refraccion: string;
        trauma_ocular: string;
        laser: string;
        otros: string;
    };
}

export const defaultAntecedentesOftalmologicos: AntecedentesOftalmologicosForm = {
    lentes_aereos: {
        ultima_refraccion: '',
        gotas: '',
        cirugias_previas: '',
        glaucoma: '',
    },
    lentes_contacto: {
        blandos: false,
        rigidos: false,
        ultima_refraccion: '',
        trauma_ocular: '',
        laser: '',
        otros: '',
    },
};
