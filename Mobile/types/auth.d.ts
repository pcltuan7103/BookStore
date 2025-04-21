interface IRegister {
    username: string;
    email: string;
    password: string;
}

interface ILogin {
    email: string;
    password: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    register: (values: IRegister) => Promise<{ success: boolean; error?: string }>;
    login: (values: ILogin) => Promise<{ success: boolean; error?: string }>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}