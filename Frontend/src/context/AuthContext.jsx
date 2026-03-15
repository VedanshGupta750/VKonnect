import { createContext, useContext ,useState } from "react";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";
import axios from "axios";  

const AuthContext = createContext({});

const client = axios.create({
  baseURL: 'http://localhost:5000/api/v1/users/', 
});

export const AuthProvider =({children})=>{

    let[userData , setUserData] = useState(null); 

    const router = useNavigate();

    const handleRegister = async(name ,username ,password)=>{
        try{
            let request = await client.post('/register',{
                name: name,
                username: username,
                password:password
            })

            if(request.status === httpStatus.CREATED){
                return request.data.message;
            }
        }
        catch(err){
            throw err;
        }
    }

    const handleLogin = async(username ,password)=>{
        try{
            let request = await client.post('/login',{
                username: username,
                password:password
            })

            if(request.status === httpStatus.OK){
                localStorage.setItem("token" , request.data.token)
                return "Login Successful";
            }
        }
        catch(err){
            throw err;
        }
    }

    const data = {
        userData,
        setUserData,
        handleRegister,
        handleLogin
    }

    return(
       <AuthContext.Provider value={data}>
       {children}
       </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);