import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AuditEntity {
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
