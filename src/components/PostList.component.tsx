import { queryOptions, useQuery } from "@tanstack/react-query";
import type { IPostResponse } from "../model/post.interface";
import { apiGet } from "../api/http.api";
import PostItem from "./PostItem.component";
import { FileWarning } from "lucide-react";
import { type Status } from "./QueryStatusIndicator.component";
import QueryStatusIndicator from "./QueryStatusIndicator.component";

interface PostListProps {
  userId: number | undefined;
}

export default function PostList({ userId }: PostListProps) {
  const limit = 5;
  const skip = 0;

  function groupOptions() {
    return queryOptions({
      queryKey: ["posts", userId],
      queryFn: () =>
        apiGet<IPostResponse>(
          `/posts/user/${userId}?limit=${limit}&skip=${skip}`
        ),
      select: (data) => data.posts,
    });
  }

  // Queries
  const { data, error, status, isFetching } = useQuery({
    ...groupOptions(),
    enabled: !!userId,
  });

  return (
    <>
      <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      />
      {data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((post) => {
            return <PostItem key={post.id} post={post} />;
          })}
        </div>
      ) : (
        <div className="flex items-center py-2 gap-2 text-gray-500">
          <FileWarning size={15} />
          <p className="text-sm font-medium ">This user has no post</p>
        </div>
      )}{" "}
    </>
  );
}
