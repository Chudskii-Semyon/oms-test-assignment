import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { EmployeeRoleEnum } from '../enums/employee-role.enum';
import { IsEmail, MinLength } from 'class-validator';

@Entity()
@Unique(['email'])
export class Employee {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'enum', enum: EmployeeRoleEnum })
    @Index()
    public role: EmployeeRoleEnum;

    @Column()
    @MinLength(3)
    public name: string;

    @Column()
    public password: string;

    @Column()
    @Index()
    @IsEmail()
    public email: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
