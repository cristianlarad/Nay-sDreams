import { format } from "date-fns";
import { Star, User } from "lucide-react";

import type { IComment } from "@/types/products";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import ExpandableText from "../ui/expandableText";

interface ICommentsProducts {
  comments: IComment[];
}

const CommentsProducts = ({ comments }: ICommentsProducts) => {
  if (!comments || comments.length === 0) {
    return (
      <Card className=" ">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-center text-xl font-serif text-pink-800">
            Comentarios
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex justify-center items-center">
          <div className="text-center text-gray-500 py-8">
            <p className="text-pink-600 mb-2">No hay comentarios todavía</p>
            <p className="text-sm">¡Sé el primero en dejar tu opinión!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className=" shadow-md">
      <CardHeader className="">
        <CardTitle className="text-center text-xl font-serif text-pink-800">
          {comments.length}{" "}
          {comments.length === 1 ? "Comentario" : "Comentarios"}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <ScrollArea className="h-[64vh]">
          <div className="mr-4">
            {comments.map((comment: IComment, index) => (
              <div key={comment.id}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-12 w-12 bg-pink-100 border border-pink-200">
                      <AvatarFallback className="text-pink-700">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <h3 className="font-medium text-pink-800">
                          {comment.username}
                        </h3>
                        <p className="text-xs text-gray-500">{comment.email}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {comment.created_at
                          ? format(
                              new Date(comment.created_at),
                              "d MMM yyyy, HH:mm"
                            )
                          : ""}
                      </div>
                    </div>

                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= comment.rating
                              ? "fill-pink-400 text-pink-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="mt-2  p-3 rounded-lg border border-pink-100">
                      <ExpandableText text={comment.comment} lineLimit={4} />
                    </div>
                  </div>
                </div>

                {index < comments.length - 1 && (
                  <Separator className="my-6 bg-pink-100" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommentsProducts;
