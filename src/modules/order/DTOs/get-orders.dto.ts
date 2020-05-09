import { IsDateString } from 'class-validator';

export class GetOrdersDto {
    @IsDateString()
    public start: string = new Date(2000, 0, 1).toISOString();

    @IsDateString()
    public end: string = new Date(Date.now()).toISOString();
}
