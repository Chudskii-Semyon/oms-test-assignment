import { IsPositive } from 'class-validator';

export class CreateOrderDto {
    @IsPositive()
    public productId: number;
}
