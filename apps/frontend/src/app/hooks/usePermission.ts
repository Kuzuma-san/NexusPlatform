import { instance as axios } from "../api/axios";
import { useQuery } from "@tanstack/react-query";

export const usePermission = () => {
    const token = localStorage.getItem("nexus_token");

    const {data: userPermission = [], isLoading} = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            if(!token) return [];
            try {
                const url = "http://localhost:3000/api/rbac/permissions";
                const {data} = await axios.get(url);
                return data;
            }catch(err){
                return [];
            }
        },
        enabled: !!token //do not run the queryFunc if no token exist
    });
    // checker function
    const can = (requiredPermission: string) => {
        if (!token) return false; // Guests can't do anything restricted
        return userPermission.includes(requiredPermission);
    };

    return { can, isLoading };
}