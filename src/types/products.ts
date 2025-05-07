import { InferType, mixed, number, object, string } from "yup";

export const productShema = object({
  id: string().required(),
  title: string().required(),
  description: string().required(),
  price: number().required(),
  collectionId: string().required(),
  collectionName: string().required(),
  image: string().required(),
  created: string().required(),
  updated: string().required(),
});

export interface ProductResponse {
  items: IProduct[];
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
type ICreateProducts = InferType<typeof createProductShema>;
type IProduct = InferType<typeof productShema>;
export type { ICreateProducts, IProduct };
export { createProductShema };
