export interface User {
    id: number;
    login: string;
    type: 'servidor' | 'aluno';
    name: string;
}

export interface Menu {
    id: number;
    date: string;
    meal_type: string;
    items: string[];
}

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Cardapio: undefined;
    CadastrarCardapio: undefined;
};