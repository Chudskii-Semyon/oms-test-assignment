import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetOrdersDto {
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    public start?: Date = new Date(2000, 0, 0);

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    public end?: Date = new Date(Date.now());
}
