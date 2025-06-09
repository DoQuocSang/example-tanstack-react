import type { IPost } from "../../model/post.interface";
import PostItem from "./PostItem.component";
import { FileWarning } from "lucide-react";
interface PostListProps {
  posts: IPost[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <>
      {/* <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      /> */}
      {posts.length ? (
        <div className="grid grid-cols-1 gap-4">
          {posts?.map((post) => {
            return <PostItem key={post.id} post={post} />;
          })}
        </div>
      ) : (
        <div className="flex items-center py-2 gap-2 text-gray-500">
          <FileWarning size={15} />
          <p className="text-sm font-medium ">This user has no post</p>
        </div>
      )}
    </>
  );
}
