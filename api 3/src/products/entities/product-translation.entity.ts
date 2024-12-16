import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  languageCode: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Product, product => product.translations, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
