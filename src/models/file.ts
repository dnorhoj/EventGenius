import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    identifier: string;

    @Column()
    name: string;

    @Column()
    size: number;

    @CreateDateColumn()
    created_at: Date;
}