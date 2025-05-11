import { number, object, string, InferType } from "yup";

const commentSchema = object({
  comment: string().required("coment.required"),
  rating: number()
    .required("rating.required")
    .max(5, "max.rating")
    .min(1, "min.rating"),
});

type IComent = InferType<typeof commentSchema>;

export type { IComent };
export { commentSchema };
