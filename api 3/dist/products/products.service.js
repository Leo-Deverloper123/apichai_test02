"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const product_translation_entity_1 = require("./entities/product-translation.entity");
let ProductsService = class ProductsService {
    constructor(productRepository, translationRepository) {
        this.productRepository = productRepository;
        this.translationRepository = translationRepository;
    }
    async create(createProductDto) {
        const product = this.productRepository.create({
            translations: createProductDto.translations,
        });
        return await this.productRepository.save(product);
    }
    async findAll() {
        return await this.productRepository.find();
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['translations'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
    async search(searchDto) {
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
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        await this.translationRepository.delete({ product: { id } });
        product.translations = updateProductDto.translations.map(translation => this.translationRepository.create({ ...translation, product }));
        return await this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_translation_entity_1.ProductTranslation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map