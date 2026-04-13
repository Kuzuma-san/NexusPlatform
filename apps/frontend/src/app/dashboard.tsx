import { useProducts } from "./hooks/useProducts";
import { useForm } from "react-hook-form";
import { CreateProductInterface } from "./types/product.type";
import { PERMISSIONS } from "./constants/permissions";
import { usePermission } from "./hooks/usePermission";

export function Dashboard(){
    const {products,isLoadingProducts,createProduct,deleteProduct} = useProducts();
    const {register, handleSubmit} = useForm<CreateProductInterface>();
    const {can} = usePermission();

    if (isLoadingProducts) {
        return <h2>Loading products...</h2>;
    }
    return(
        <div>
            <h1>Products</h1>
            {(products ?? []).map((item: any) => ( //implicit return
                <div key={item.id}>
                    <h2>{item.name}</h2>
                    <p>
                        {item.price}<br />
                        {item.description}<br />
                        {item.stock}
                    </p>
                {/* 🛡️ RBAC: Only show Delete if allowed*/}
                {can(PERMISSIONS.PRODUCT_DELETE) && (
                    <button onClick={() => deleteProduct.mutate(item.id)} style={{color: 'red'}}>Delete</button>
                )}
                </div>
            ))}
            {can(PERMISSIONS.PRODUCT_CREATE) && (
                <><h2>Create a Product</h2><form onSubmit={handleSubmit((data) => createProduct.mutate(data))}>
                    <input placeholder="Product Name" {...register("name", { required: true })} />
                    <input placeholder="Price" {...register("price", { required: true, valueAsNumber: true })} />
                    <input placeholder="Description" {...register("description")} />
                    <input placeholder="Stock" {...register("stock", { required: true, valueAsNumber: true })} />
                    <select {...register("currency")}>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                    </select>
                    <input type="submit" />
                </form></>
            )}
            
        </div>
    )
}