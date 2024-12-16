# Multilingual Products API

A NestJS application that provides REST APIs for managing multilingual products with PostgreSQL.

## Features

- Create, read, update, and delete products with multilingual support
- Search products by name in any language
- Pagination support for search results
- Swagger API documentation
- PostgreSQL database with TypeORM

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- npm or yarn

## ข้อกำหนดระบบ

### Database
- PostgreSQL เวอร์ชัน 17
- ไม่ต้องใช้รหัสผ่านในการเชื่อมต่อ (trust authentication)

### การตั้งค่าฐานข้อมูล
1. ติดตั้ง PostgreSQL 17
2. สร้างฐานข้อมูลชื่อ `product_db`
3. ตั้งค่าการเชื่อมต่อใน `typeorm.config.js`:
   ```javascript
   {
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     database: 'product_db'
   }
   ```

### การรันโปรแกรม
1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
2. รันโปรแกรม:
   ```bash
   npm run start
   ```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the database:
- Create a PostgreSQL database named 'multilingual_products'
- Update database credentials in `src/config/typeorm.config.ts` if needed

3. Start the application:
```bash
npm run start:dev
```

## API Documentation

Once the application is running, visit `http://localhost:3000/api` to access the Swagger documentation.

## API Endpoints

### Products

- `POST /products` - Create a new product
- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product
- `PATCH /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product
- `GET /products/search` - Search products with pagination

## Example Usage

### Creating a Product

```json
POST /products
{
  "translations": [
    {
      "languageCode": "en",
      "name": "Laptop",
      "description": "High-performance laptop"
    },
    {
      "languageCode": "es",
      "name": "Portátil",
      "description": "Portátil de alto rendimiento"
    }
  ]
}
```

### Searching Products

```
GET /products/search?searchTerm=laptop&languageCode=en&page=1&limit=10
```

## Testing

```bash
# unit tests
npm run test

# test coverage
npm run test:cov
```

## หมายเหตุ
- ต้องมี PostgreSQL 17 ติดตั้งในเครื่อง
- ต้องสร้างฐานข้อมูล product_db ก่อนรันโปรแกรม
- การเชื่อมต่อฐานข้อมูลใช้ trust authentication (ไม่ต้องใช้รหัสผ่าน)
