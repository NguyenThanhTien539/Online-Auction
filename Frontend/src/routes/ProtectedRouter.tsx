import {createContext, useContext, useState, useEffect} from "react";



const AuthContext = createContext<AuthType | null>(null);
export type AuthType = {
    user_id: number;
    username: string;
    email: string;
    full_name: string,
    role: string,
}
export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<AuthType | null>(null);
    async function getUserData(){
        try{
            const response = await fetch ("http://localhost:5000/api/me", {
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok){
                setUser (data.data);
            }
            else{
                setUser (null);
            }
        }
        catch(e){
            setUser (null);
        }
    }
    useEffect (()=>{
        getUserData();
    }, []);

    return (
        <AuthContext.Provider value = {user}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth(){
    return useContext(AuthContext);
}