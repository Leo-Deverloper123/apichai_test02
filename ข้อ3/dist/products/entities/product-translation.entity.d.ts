import { Product } from './product.entity';
export declare class ProductTranslation {
    id: string;
    languageCode: string;
    name: string;
    description: string;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
}
