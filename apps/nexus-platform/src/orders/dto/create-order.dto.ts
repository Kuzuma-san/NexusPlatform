import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { Currency, CURRENCY_VALUES, SUPPORTED_CURRENCIES } from "../../common/constants/currency";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {
    @IsArray()
    items!: CreateOrderItemDto[];
    
    @IsEnum(SUPPORTED_CURRENCIES)
    @IsOptional()
    currency?: Currency;
}
