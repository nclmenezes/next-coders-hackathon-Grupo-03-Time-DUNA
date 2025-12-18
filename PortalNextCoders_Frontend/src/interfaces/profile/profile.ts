export interface citys {
    id: number;
    nome: string;
}

export interface SelectLocal {
    textUf: string;
    textCity: string;

    valueUf: string;
    valueCity: string;
    changeCity: (param?: any, param2?: any) => void;
    disabled?: boolean;
    citys: citys[];
}