import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { EmployeeRoleEnum } from '../enums/employee-role.enum';
import { IsEmail, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email'])
export class Employee {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'enum', enum: EmployeeRoleEnum })
    @Index()
    @Exclude()
    @ApiHideProperty()
    public role: EmployeeRoleEnum;

    @Column()
    @MinLength(3)
    public name: string;

    @Column()
    @Exclude()
    @ApiHideProperty()
    public password: string;

    @Column()
    @Index()
    @IsEmail()
    public email: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;

    constructor(partial: Partial<Employee>) {
        Object.assign(this, partial);
    }

    @BeforeInsert()
    async setPassword(password: string): Promise<void> {
        const salt = await genSalt();
        this.password = await hash(password || this.password, salt);
    }
}
