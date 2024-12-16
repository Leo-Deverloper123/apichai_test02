import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';
import { SearchResult } from './interfaces/product.interface';
export declare class ProductsService {
    private readonly productRepository;
    private readonly translationRepository;
    constructor(productRepository: Repository<Product>, translationRepository: Repository<ProductTranslation>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    search(searchDto: SearchProductDto): Promise<SearchResult>;
    update(id: string, updateProductDto: CreateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
}
