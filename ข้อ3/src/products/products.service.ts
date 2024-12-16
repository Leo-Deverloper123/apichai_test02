import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';
import { SearchResult } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductTranslation)
    private readonly translationRepository: Repository<ProductTranslation>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      translations: createProductDto.translations,
    });
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['translations'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async search(searchDto: SearchProductDto): Promise<SearchResult> {
    const { searchTerm, languageCode, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.translations', 'translation');

    if (searchTerm) {
      queryBuilder.where('translation.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }

    if (languageCode) {
      queryBuilder.andWhere('translation.languageCode = :languageCode', {
        languageCode,
      });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateProductDto: CreateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Remove existing translations
    await this.translationRepository.delete({ product: { id } });

    // Add new translations
    product.translations = updateProductDto.translations.map(translation =>
      this.translationRepository.create({ ...translation, product }),
    );

    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
