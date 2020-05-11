import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Min, MinLength } from 'class-validator';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @MinLength(3)
    public name: string;

    @Column({ type: 'float' })
    @Min(0)
    public price: number;

    @Column({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
