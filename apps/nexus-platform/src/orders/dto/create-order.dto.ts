import { Currency } from "../../products/entities/product.entity";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {
    items: CreateOrderItemDto[];
    currrency: Currency;
}
