import React, { createContext, useState, useEffect, useContext } from 'react';

interface Usuario {
    id_usuario: number;
    nome: string;
    email: string;
    role: string;
}

interface AuthContextData {
    autenticado: boolean;
    usuario: Usuario | null;
    loading: boolean;
    login: (token: string, usuarioData: Usuario) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokenSalvo = localStorage.getItem('@TechForge:token');
        const usuarioSalvo = localStorage.getItem('@TechForge:usuario');

        if (tokenSalvo && usuarioSalvo) {
            setUsuario(JSON.parse(usuarioSalvo));
        }
        setLoading(false);
    }, []);

    const login = (token: string, usuarioData: Usuario) => {
        localStorage.setItem('@TechForge:token', token);
        localStorage.setItem('@TechForge:usuario', JSON.stringify(usuarioData));
        setUsuario(usuarioData);
    };

    const logout = () => {
        localStorage.removeItem('@TechForge:token');
        localStorage.removeItem('@TechForge:usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ autenticado: !!usuario, usuario, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}