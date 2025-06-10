import { useQueries, useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/http.api";
import UserItem from "./UserItem.compnent";
import QueryStatusIndicator from "../common/QueryStatusIndicator.component";
import Pagination from "../common/Pagination.component";
import { usePaginationStore } from "../../stores/pagination.store";
import { useEffect } from "react";
import type { Status } from "../../model/status.model";
import { type IPostResponse } from "../../model/post.interface";
import useCustomQuery from "../../hooks/useCustomQuery.hook";

export default function UserList() {
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);
  const setTotalPage = usePaginationStore((state) => state.setTotalPage);
  const setIsPlaceholderData = usePaginationStore(
    (state) => state.setIsPlaceholderData
  );

  const { usersGroupOptions, limit } = useCustomQuery();

  // Queries
  const { data, error, status, isFetching, isSuccess, isPlaceholderData } =
    useQuery(usersGroupOptions());

  const userPostsData = useQueries({
    queries: data
      ? data.users.map((user) => {
          return {
            queryKey: ["posts", user.id],
            queryFn: () =>
              apiGet<IPostResponse>(`/posts/user/${user.id}?limit=5&skip=0`),
            select: (data: IPostResponse) => data.posts,
          };
        })
      : [],
  });

  useEffect(() => {
    if (isSuccess) {
      setTotalPage(Math.ceil(data.total / limit));
      setIsPlaceholderData(isPlaceholderData);
    }
  }, [
    data,
    isSuccess,
    isPlaceholderData,
    setCurrentPage,
    setTotalPage,
    setIsPlaceholderData,
    limit,
  ]);

  return (
    <>
      <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      />
      <div className="flex flex-col gap-6 max-w-xl">
        {data?.users.map((user, index) => {
          const posts = userPostsData[index]?.data ?? [];
          return <UserItem key={user.id} user={user} posts={posts} />;
        })}
      </div>
      <Pagination />
    </>
  );
}
