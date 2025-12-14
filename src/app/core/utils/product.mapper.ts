import { ApiProduct } from "../models/api/product-api.model";
import { Product } from "../models/domain/product.model";

export function mapApiProductToProduct(api: ApiProduct): Product {
  return {
    id: api.id,
    title: api.title,
    price: api.price,
    description: api.description,
    category: api.category,
    image: api.image,
    rating: api.rating
      ? {
          rate: api.rating.rate,
          count: api.rating.count,
        }
      : undefined,
  };
}
