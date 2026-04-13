import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance as axios } from '../api/axios'; // Use your Interceptor!

export const useProducts = () => {
    const queryClient = useQueryClient();

    //Read 
    const productQuery = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const url = "http://localhost:3000/api/products";
            const {data} = await axios.get(url);
            return data;
        }
    });

    //Create
    const createProductsMutation = useMutation({
        mutationFn: async (newProduct :{name: string, price: number, currency?: string, description?: string, stock: number}) => {
            const url = "http://localhost:3000/api/products";
            await axios.post(url,newProduct);
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['products']}) //auto-refresh i.e refetch products through key using usequery manually
    });
    const deleteProductMutation = useMutation({
        mutationFn: async(productId: string) => {
            const url = `http://localhost:3000/api/products/${productId}`;
            await axios.delete(url);
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['products']}) //auto-refresh i.e refetch products through key using usequery manually
    })

    return {
        products: productQuery.data, // array of product objects
        isLoadingProducts: productQuery.isLoading, // loading state while fetching products
        createProduct: createProductsMutation,// function to create a product
        deleteProduct: deleteProductMutation,
        isDeletingProduct: deleteProductMutation.isPending,
    }
}