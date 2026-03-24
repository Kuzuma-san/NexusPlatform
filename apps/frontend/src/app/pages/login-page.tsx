import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { instance as axios } from '../api/axios';
import { LoginInterface } from "../types/auth.types";

export function Login(){
    // const data = useForm();
    // const register = data.register;
    // const handleSubmit = data.handleSubmit; // Better for checking what values data consist

    const {register, handleSubmit} = useForm<LoginInterface>();
    const navigate = useNavigate();

    async function loginRequest(data: {identifier: string, password: string}){
        const url = "http://localhost:3000/api/auth/login";
        const response = await axios.post(url,{
            identifier: data.identifier,
            password:   data.password,
        });
        localStorage.setItem('nexus_token',response.data.access_token);
        alert(`Login Successful ${response.data.access_token}`);
        navigate("/dashboard");
    }
    return (
        <form onSubmit={handleSubmit(loginRequest)}>
            <input placeholder="Enter Username or Email" {...register("identifier", {required: true})} />
            <input placeholder="Password" {...register("password",{required:true})} />
            <input type="submit" />
        </form>
    )
}
