import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Receipt {
    @PrimaryGeneratedColumn()
    public id: number;

    @ApiHideProperty()
    @OneToOne(() => Order)
    @JoinColumn()
    public order: Order;

    @RelationId((receipt: Receipt) => receipt.order)
    public orderId: number;

    @ManyToOne(() => Product)
    public product: Product;

    @RelationId((receipt: Receipt) => receipt.product)
    public productId: number;

    @Column({ type: 'float' })
    public total: number;

    @Column({ type: 'float' })
    public discount: number;

    @Column()
    public orderCreatedAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
