import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReceiptDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public orderId: number;
}
