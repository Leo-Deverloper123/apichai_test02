import { ProductTranslation } from './product-translation.entity';
export declare class Product {
    id: string;
    translations: ProductTranslation[];
    createdAt: Date;
    updatedAt: Date;
}
