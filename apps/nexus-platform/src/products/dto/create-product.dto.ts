import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Currency, CURRENCY_VALUES, SUPPORTED_CURRENCIES } from "../../common/constants/currency";

// Find the user location and Timezone to find the currency or do so in frontend and pass in body
export class CreateProductDto {
    @IsString()
    name!: string;

    @IsNumber()
    price!: number;

    @IsEnum(SUPPORTED_CURRENCIES)
    @IsOptional()
    currency?: Currency;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    stock!: number;

}
