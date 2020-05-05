import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Product } from './product.entity';
import { Employee } from './employee.entity';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { Min } from 'class-validator';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    public id: number;

    @OneToOne(type => Product)
    @JoinColumn()
    public product: Product;

    @Column({ default: 0, type: 'float' })
    @Min(0)
    public discount: number;

    @Column({ type: 'float' })
    @Min(0)
    public subTotal: number;

    @Column({ type: 'float' })
    @Min(0)
    public total: number;

    @Column({ type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.CREATED })
    @Index()
    public status: OrderStatusEnum;

    @OneToOne(type => Employee)
    @JoinColumn()
    public cashier: Employee;

    @OneToOne(type => Employee)
    @JoinColumn()
    public shopAssistant: Employee;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
