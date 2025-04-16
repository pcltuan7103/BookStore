interface IRegister {
    username: string;
    email: string;
    password: string;
}

interface AuthStore {
    user: any;
    token: string | null;
    isLoading: boolean;
    register: (values: IRegister) => Promise<{ success: boolean; error?: string }>;
}