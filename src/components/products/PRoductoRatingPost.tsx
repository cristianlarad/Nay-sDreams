"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Star } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { commentSchema, type IComent } from "@/types/coment";
import usePost from "@/hooks/usePost";
import { toast } from "sonner";

interface ProductCommentProps {
  productID: string;
}

const ProductRatingPost = ({ productID }: ProductCommentProps) => {
  const navigate = useNavigate();
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<IComent>({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      comment: "",
      rating: 3,
    },
  });

  const { mutate } = usePost({
    url: `product/${productID}/add-comment`,
    onSuccess() {
      toast.success(t("comment.add"));
      navigate(-1);
    },
    onError() {
      toast.error(t("error.comment.add"));
    },
  });

  const onSubmit = async (data: IComent) => {
    console.log(data);
    mutate({
      data,
    });
  };

  const handleStarClick = (rating: number) => {
    form.setValue("rating", rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const currentRating = hoveredRating || form.watch("rating");

  return (
    <Card className="max-w-md w-full  ">
      <CardHeader className="space-y-1 rounded-t-lg">
        <CardTitle className="text-center text-2xl font-serif text-pink-800">
          {t("rate.our.product")}
        </CardTitle>
        <CardDescription className="text-center text-pink-600">
          {t("we.value.your.opinion")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-pink-700">
                {t("your.rating")}
              </label>
              <div
                className="flex justify-center gap-1"
                onMouseLeave={handleStarLeave}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                      star <= currentRating
                        ? "fill-pink-400 text-pink-400"
                        : "text-gray-300"
                    } hover:scale-110`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-pink-700">
                {t("comment")}
              </label>
              <Textarea
                {...form.register("comment")}
                placeholder={t("Tell us what you think about our product...")}
                className="min-h-[120px] border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
              {form.formState.errors.comment && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.comment.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
            >
              {t("send")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-pink-100 pt-4 text-xs text-pink-400">
        {t("thank.you.for.helping.us.improve")}
      </CardFooter>
    </Card>
  );
};

export default ProductRatingPost;
