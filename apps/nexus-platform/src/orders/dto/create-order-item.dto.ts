import { IsNumber } from "class-validator";

export class CreateOrderItemDto {
    @IsNumber()
    productId!: number;

    @IsNumber()
    quantity!: number;
}
// ! means to assure typescript that this will not be undefined and something will be provided for this