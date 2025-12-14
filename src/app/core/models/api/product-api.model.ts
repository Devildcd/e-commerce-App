export interface ApiProductRating {
  rate: number;
  count: number;
}

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ApiProductRating;
}

export interface ProductsByCategory {
  category: string;
  products: ApiProduct[];
}

export type ApiProductCategory = string;
