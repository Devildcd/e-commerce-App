export interface ApiCartProduct {
  productId: number;
  quantity: number;
}

export interface ApiCart {
  id: number;
  userId: number;
  date: string;   //<- por si acaso tener cuidado con este campo, revisar luego
  products: ApiCartProduct[];
  __v?: number;
}
