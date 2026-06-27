import {createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
}

interface AuthContextData {
    user: User | null;
    token: string | null;
    signIn: (token: string, user: User) => void;
    signOut: () => void;
    updateUser: (user: User) => void;
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    
    useEffect(() => {
        const storedToken = localStorage.getItem('@helpdesk:token');
        const storedUser = localStorage.getItem('@helpdesk:user');
        
        if(storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, [])

    function signIn(
        token: string,
        user: User
    ) {
        localStorage.setItem('@helpdesk:token', token);
        localStorage.setItem('@helpdesk:user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
    }
    
    function signOut() {
        localStorage.removeItem('@helpdesk:token');
        localStorage.removeItem('@helpdesk:user');

        
        setToken(null);
        setUser(null);

    }

    function updateUser(userData: User) {

    localStorage.setItem(
        '@helpdesk:user',
        JSON.stringify(userData)
    );

    setUser(userData);
}
    
    return(
        <AuthContext.Provider value={{user, token, signIn, signOut, updateUser, isAuthenticated: !!token}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}