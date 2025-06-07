import { Eye, ThumbsDown, ThumbsUp } from "lucide-react";
import type { IPost } from "../model/post.interface";

interface PostListProps {
  post: IPost;
}

export default function PostItem({ post }: PostListProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-md shadow text-slate-700">
      <h1 className="font-medium text-sm">{post.title}</h1>
      <p className="text-xs line-clamp-3">{post.body}</p>
      <div className="flex justify-between items-center mt-2 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <p className="font-medium">Tag:</p>
          <div className="flex items-center gap-2">
            {post.tags.map((tag) => {
              return (
                <div className="px-2 py-1 leading-none rounded-lg bg-blue-100 text-blue-700">
                  {tag}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ThumbsUp size={15} />
            {post.reactions.likes}
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown size={15} />
            {post.reactions.dislikes}
          </div>
          <div className="flex items-center gap-2">
            <Eye size={15} />
            {post.views}
          </div>
        </div>
      </div>
    </div>
  );
}
