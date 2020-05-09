import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetOrderDto {
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    public orderId: number;
}
