import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import type { IUsersResponse } from "../../model/user.interface";
import { apiGet } from "../../api/http.api";
import UserItem from "./UserItem.compnent";
import { type Status } from "../common/QueryStatusIndicator.component";
import QueryStatusIndicator from "../common/QueryStatusIndicator.component";
import Pagination from "../common/Pagination.component";
import { usePaginationStore } from "../../stores/pagination.store";
import { useEffect } from "react";

export default function UserList() {
  const currentPage = usePaginationStore((state) => state.currentPage);
  const limit = 10;
  const skip = (currentPage - 1) * limit;
  const setCurrentPage = usePaginationStore((state) => state.setCurrentPage);
  const setTotalPage = usePaginationStore((state) => state.setTotalPage);
  const setIsPlaceholderData = usePaginationStore(
    (state) => state.setIsPlaceholderData
  );

  function groupOptions() {
    return queryOptions({
      queryKey: ["users", currentPage],
      queryFn: () =>
        apiGet<IUsersResponse>(`/users?limit=${limit}&skip=${skip}`),
      retry: 5,
      retryDelay: 1000,
      placeholderData: keepPreviousData,
    });
  }

  // Queries
  const { data, error, status, isFetching, isSuccess, isPlaceholderData } =
    useQuery(groupOptions());

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
  ]);

  return (
    <>
      <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      />
      <div className="flex flex-col gap-6 max-w-xl">
        {data?.users.map((user) => {
          return <UserItem key={user.id} user={user} />;
        })}
      </div>
      <Pagination />
    </>
  );
}
