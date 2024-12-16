"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const product_entity_1 = require("../products/entities/product.entity");
const product_translation_entity_1 = require("../products/entities/product-translation.entity");
exports.typeOrmConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    database: 'product_db',
    entities: [product_entity_1.Product, product_translation_entity_1.ProductTranslation],
    synchronize: true,
};
//# sourceMappingURL=typeorm.config.js.map