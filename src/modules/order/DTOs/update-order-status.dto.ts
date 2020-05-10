import { OrderStatusEnum } from '../../../enums/order-status.enum';
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatusEnum)
    @IsNotEmpty()
    public status: OrderStatusEnum;

    @IsInt()
    @IsPositive()
    public orderId: number;
}
