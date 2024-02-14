import React, {useState, createContext, ReactNode, useEffect} from "react";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type authContextData = {
    user: UserProps,
    isAuthenticated: boolean,
    signIn: (credentials: SignInProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    signOut: () => Promise<void>
}

type UserProps = {
    id: string,
    name: string,
    email: string,
    token: string
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as authContextData);

export function AuthProvider({children}:AuthProviderProps){
    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    })
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    // !! = convertendo para boolean
    const isAuthenticated = !!user.name

    useEffect(() => {
        async function getUser() {
            //pegar os dados salvos do user
            const userInfo = await AsyncStorage.getItem("@sujeitopizzaria");
            let hasUser: UserProps = JSON.parse(userInfo || '{}')
            
            //Verificar se recebemos as informações dele
            if(Object.keys(hasUser).length > 0){
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`

                setUser({
                    id: hasUser.id,
                    name: hasUser.name,
                    email: hasUser.email,
                    token: hasUser.token
                })
            }
            setLoading(false)
        }
        getUser()
    }, [])

    async function signIn({email, password}: SignInProps){
        setLoadingAuth(true)

        try{
            const response = await api.post("/session", {
                email, password
        })

        // console.log(response.data)
        //pegando informações do usuário
        const { id, name, token} = response.data

        //O asyncStorage só aceita string, então vou converter aqui o objeto
        const data = {
            ...response.data
        }

        //salvando no storage
        await AsyncStorage.setItem("@sujeitopizzaria", JSON.stringify(data))

        //iformando o token para as próximas requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        setUser({
            id,
            name,
            email,
            token
        })

        }catch(err){
            console.log("Erro ao acessar" + " " + err)
            setLoadingAuth(false)
        }

    }
    
    async function signOut() {
        await AsyncStorage.clear()
        .then(() => {
            setUser({
                id: '',
                name: '',
                email: '',
                token: ''
            })
        })
    }

    return(
        <AuthContext.Provider 
            value={{
                user,
                isAuthenticated,
                signIn,
                loading,
                loadingAuth,
                signOut
            }}>
            {children}
        </AuthContext.Provider>
    )
}