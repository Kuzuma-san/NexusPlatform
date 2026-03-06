import { Currency } from "../entities/product.entity";

// Find the user location and Timezone to find the currency or do so in frontend and pass in body
export class CreateProductDto {
    name: string;

    price: number;

    currency: Currency;

    desciption: string;

    stock: number;

}
