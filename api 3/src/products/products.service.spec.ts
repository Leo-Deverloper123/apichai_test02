import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductTranslation } from './entities/product-translation.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let translationRepository: Repository<ProductTranslation>;

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
      if (id === '1') return Promise.resolve(mockProduct);
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductTranslation),
          useValue: mockTranslationRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    translationRepository = module.get<Repository<ProductTranslation>>(
      getRepositoryToken(ProductTranslation),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product with translations', async () => {
      const createProductDto: CreateProductDto = {
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
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
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
      const updateProductDto: CreateProductDto = {
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
      const updateProductDto: CreateProductDto = {
        translations: [
          {
            languageCode: 'en',
            name: 'Test',
            description: 'Test',
          },
        ],
      };

      await expect(service.update('999', updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
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
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
