"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const product_entity_1 = require("./entities/product.entity");
const typeorm_1 = require("@nestjs/typeorm");
const product_translation_entity_1 = require("./entities/product-translation.entity");
describe('ProductsController', () => {
    let controller;
    let service;
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
    const mockProductsService = {
        create: jest.fn().mockResolvedValue(mockProduct),
        findAll: jest.fn().mockResolvedValue([mockProduct]),
        findOne: jest.fn().mockResolvedValue(mockProduct),
        search: jest.fn().mockResolvedValue({
            items: [mockProduct],
            total: 1,
            page: 1,
            limit: 10,
        }),
        update: jest.fn().mockResolvedValue(mockProduct),
        remove: jest.fn().mockResolvedValue(undefined),
    };
    const mockProductRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(),
        remove: jest.fn(),
    };
    const mockTranslationRepository = {
        create: jest.fn(),
        delete: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [products_controller_1.ProductsController],
            providers: [
                {
                    provide: products_service_1.ProductsService,
                    useValue: mockProductsService,
                },
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
        controller = module.get(products_controller_1.ProductsController);
        service = module.get(products_service_1.ProductsService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a product', async () => {
            const createProductDto = {
                translations: [
                    {
                        languageCode: 'en',
                        name: 'Test Product',
                        description: 'Test Description',
                    },
                ],
            };
            const result = await controller.create(createProductDto);
            expect(result).toEqual(mockProduct);
            expect(service.create).toHaveBeenCalledWith(createProductDto);
        });
    });
    describe('findAll', () => {
        it('should return an array of products', async () => {
            const result = await controller.findAll();
            expect(result).toEqual([mockProduct]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });
    describe('search', () => {
        it('should search products', async () => {
            const searchDto = {
                searchTerm: 'test',
                languageCode: 'en',
                page: 1,
                limit: 10,
            };
            const result = await controller.search(searchDto);
            expect(result).toEqual({
                items: [mockProduct],
                total: 1,
                page: 1,
                limit: 10,
            });
            expect(service.search).toHaveBeenCalledWith(searchDto);
        });
    });
    describe('findOne', () => {
        it('should return a product', async () => {
            const result = await controller.findOne('1');
            expect(result).toEqual(mockProduct);
            expect(service.findOne).toHaveBeenCalledWith('1');
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
            const result = await controller.update('1', updateProductDto);
            expect(result).toEqual(mockProduct);
            expect(service.update).toHaveBeenCalledWith('1', updateProductDto);
        });
    });
    describe('remove', () => {
        it('should remove a product', async () => {
            await controller.remove('1');
            expect(service.remove).toHaveBeenCalledWith('1');
        });
    });
});
//# sourceMappingURL=products.controller.spec.js.map