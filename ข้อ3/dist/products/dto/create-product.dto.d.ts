import { ProductTranslation } from '../interfaces/product.interface';
export declare class TranslationDto implements ProductTranslation {
    languageCode: string;
    name: string;
    description: string;
}
export declare class CreateProductDto {
    translations: TranslationDto[];
}
