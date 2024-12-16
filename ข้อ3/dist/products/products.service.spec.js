"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const products_service_1 = require("./products.service");
const product_entity_1 = require("./entities/product.entity");
const product_translation_entity_1 = require("./entities/product-translation.entity");
const common_1 = require("@nestjs/common");
describe('ProductsService', () => {
    let service;
    let productRepository;
    let translationRepository;
    const mockProduct = {
        id: '1',
        translations: [
            {
                id: '1',
                languageCode: 'en',
                name: 'Test Product',
                description: 'Test Description',
            },
        ],
    };
    const mockProductRepository = {
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn().mockImplementation(product => Promise.resolve({ id: '1', ...product })),
        find: jest.fn().mockResolvedValue([mockProduct]),
        findOne: jest.fn().mockImplementation(({ where: { id } }) => {
            if (id === '1')
                return Promise.resolve(mockProduct);
            return Promise.resolve(null);
        }),
        createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
        })),
        remove: jest.fn().mockResolvedValue(mockProduct),
    };
    const mockTranslationRepository = {
        create: jest.fn().mockImplementation(dto => dto),
        delete: jest.fn().mockResolvedValue(undefined),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                products_service_1.ProductsService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(product_entity_1.Product),
                    useValue: mockProductRepository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(product_translation_entity_1.ProductTranslation),
                    useValue: mockTranslationRepository,
                },
            ],
        }).compile();
        service = module.get(products_service_1.ProductsService);
        productRepository = module.get((0, typeorm_1.getRepositoryToken)(product_entity_1.Product));
        translationRepository = module.get((0, typeorm_1.getRepositoryToken)(product_translation_entity_1.ProductTranslation));
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('should create a product with translations', async () => {
            const createProductDto = {
                translations: [
                    {
                        languageCode: 'en',
                        name: 'Test Product',
                        description: 'Test Description',
                    },
                ],
            };
            const result = await service.create(createProductDto);
            expect(result).toEqual({
                id: '1',
                translations: createProductDto.translations,
            });
            expect(productRepository.create).toHaveBeenCalledWith({
                translations: createProductDto.translations,
            });
            expect(productRepository.save).toHaveBeenCalled();
        });
    });
    describe('findAll', () => {
        it('should return an array of products', async () => {
            const result = await service.findAll();
            expect(result).toEqual([mockProduct]);
            expect(productRepository.find).toHaveBeenCalled();
        });
    });
    describe('findOne', () => {
        it('should return a product by id', async () => {
            const result = await service.findOne('1');
            expect(result).toEqual(mockProduct);
            expect(productRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['translations'],
            });
        });
        it('should throw NotFoundException when product not found', async () => {
            await expect(service.findOne('999')).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('search', () => {
        it('should search products by name', async () => {
            const searchDto = {
                searchTerm: 'Test',
                languageCode: 'en',
                page: 1,
                limit: 10,
            };
            const result = await service.search(searchDto);
            expect(result.items).toEqual([mockProduct]);
            expect(result.total).toBe(1);
            expect(productRepository.createQueryBuilder).toHaveBeenCalled();
        });
    });
    describe('update', () => {
        it('should update a product', async () => {
            const updateProductDto = {
                translations: [
                    {
                        languageCode: 'en',
                        name: 'Updated Product',
                        description: 'Updated Description',
                    },
                ],
            };
            const result = await service.update('1', updateProductDto);
            expect(result).toBeDefined();
            expect(translationRepository.delete).toHaveBeenCalled();
            expect(productRepository.save).toHaveBeenCalled();
        });
        it('should throw NotFoundException when updating non-existent product', async () => {
            const updateProductDto = {
                translations: [
                    {
                        languageCode: 'en',
                        name: 'Test',
                        description: 'Test',
                    },
                ],
            };
            await expect(service.update('999', updateProductDto)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should remove a product', async () => {
            await service.remove('1');
            expect(productRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['translations'],
            });
            expect(productRepository.remove).toHaveBeenCalledWith(mockProduct);
        });
        it('should throw NotFoundException when removing non-existent product', async () => {
            await expect(service.remove('999')).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=products.service.spec.js.map