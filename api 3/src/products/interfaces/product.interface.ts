export interface ProductTranslation {
  languageCode: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  translations: ProductTranslation[];
}

export interface SearchResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
