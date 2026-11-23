interface Usuario {
  id: number;
  name: string;
  nome?: string;
  email: string;
  birthday?: string | Date | null;
  tel?: string | null;
}

interface CadastroUsuario {
  name: string;
  email: string;
  password: string;
  birthday: string;
  tel: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface Animal {
  id?: number | string;
  nome: string;
  cor: string;
  raca: string;
  idade: number;
  especie: string;
}

interface ArkheApi {
  openMainPage(): Promise<void>;
  signUp(data: CadastroUsuario): Promise<{ id: number } & CadastroUsuario>;
  login(payload: LoginPayload): Promise<Usuario | null>;
  PegarDados(): Promise<Usuario | null>;
  VerificarLogado(): Promise<boolean>;
  abrirCadastroAnimal(): Promise<void>;
  cadastrarAnimal(data: Animal): Promise<{ id: number } & Animal>;
  carregarAnimais(): Promise<Animal[]>;
  excluirAnimal(id: number | string): Promise<unknown>;
}

interface Window {
  api: ArkheApi;
}

declare namespace bootstrap {
  class Modal {
    constructor(element: Element);
    show(): void;
    hide(): void;
  }
}
