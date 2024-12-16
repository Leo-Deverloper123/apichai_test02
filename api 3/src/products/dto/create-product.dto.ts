import { IsString, IsNotEmpty, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductTranslation } from '../interfaces/product.interface';

export class TranslationDto implements ProductTranslation {
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateProductDto {
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  @ArrayMinSize(1)
  translations: TranslationDto[];
}
