import { OrderStatusEnum } from '../../../enums/order-status.enum';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

const { COMPLETED, PAID } = OrderStatusEnum;

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatusEnum)
    @IsIn([COMPLETED, PAID])
    @IsNotEmpty()
    public status: OrderStatusEnum;

    @IsInt()
    @IsPositive()
    public orderId: number;
}
