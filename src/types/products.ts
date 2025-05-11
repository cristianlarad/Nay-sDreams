import { array, date, InferType, mixed, number, object, string } from "yup";

const commentSchema = object({
  id: string().required(),
  comment: string().required(),
  rating: number().required(),
  username: string().required(),
  email: string().required(),
  created_at: date().required(),
});
export const productShema = object({
  id: string().required(),
  title: string().required(),
  description: string().required(),
  price: number().required(),
  rating: number().default(1),
  image_url: string().required(),
  created: string().required(),
  comment: array().of(commentSchema),
});
export interface ProductFilters {
  // Add export
  searchTerm: string;
  minPrice?: number;
  maxPrice?: number;
}
export interface ProductResponse {
  products: IProduct[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

const createProductShema = object({
  title: string().required("Title is required"),
  description: string().required("Description is required"),

  price: number()
    .positive("Price must be positive")
    .required("Price is required"),
  image: mixed<File>()
    .test("fileSize", "File is too large", (value) => {
      // Check file size (e.g., max 5MB)
      if (!value) return true; // Allow no file
      return value instanceof File && value.size <= 5 * 1024 * 1024; // 5MB limit
    })
    .test("fileType", "Unsupported file type", (value) => {
      // Check file type
      if (!value) return true; // Allow no file
      const supportedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      return value instanceof File && supportedTypes.includes(value.type);
    })
    .required("Image is required"), //
});

const productOneShema = object({
  product: productShema,
});
type ICreateProducts = InferType<typeof createProductShema>;
type IProduct = InferType<typeof productShema>;
type IProductOne = InferType<typeof productOneShema>;
type IComment = InferType<typeof commentSchema>;
export type { ICreateProducts, IProduct, IProductOne, IComment };
export { createProductShema, productOneShema, commentSchema };
