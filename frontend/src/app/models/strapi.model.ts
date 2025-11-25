/**
 * Tipos genéricos de respuestas de Strapi 5.x
 */

export interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta?: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiEntity {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
