import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['sourceCurrency', 'destinationCurrency'])
export class FxqlEntry {
  @PrimaryGeneratedColumn()
  EntryId: number;

  @Column({ length: 3 })
  sourceCurrency: string;

  @Column({ length: 3 })
  destinationCurrency: string;

  @Column('decimal', { precision: 12, scale: 5 })
  buyPrice: number;

  @Column('decimal', { precision: 12, scale: 5 })
  sellPrice: number;

  @Column('bigint')
  capAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
