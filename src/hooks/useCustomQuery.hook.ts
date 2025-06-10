import {
  keepPreviousData,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { apiGet } from "../api/http.api";
import type { ITodosResponse } from "../model/todo.interface";
import type { IQueryParam } from "../model/query-param.interface";
import type { IUsersResponse } from "../model/user.interface";
import { usePaginationStore } from "../stores/pagination.store";

export default function useCustomQuery() {
  const queryClient = useQueryClient();

  const currentPage = usePaginationStore((state) => state.currentPage);

  const limit = 10;
  const userQueryParam: IQueryParam = {
    limit: limit,
    skip: (currentPage - 1) * limit,
  };

  const todoQueryParam: IQueryParam = {
    limit: limit,
    skip: 0,
  };

  function todosGroupOptions() {
    return queryOptions({
      queryKey: ["todos"],
      queryFn: async ({ signal }) => {
        // await delay(5000);
        const todoResponse = await apiGet<ITodosResponse>(
          `/todos?limit=${todoQueryParam.limit}&skip=${todoQueryParam.skip}`,
          signal
        );
        return todoResponse;
      },
      staleTime: 5 * 1000,
      select: (data) => data.todos,
    });
  }

  function usersGroupOptions() {
    return queryOptions({
      queryKey: ["users", currentPage],
      queryFn: () =>
        apiGet<IUsersResponse>(
          `/users?limit=${userQueryParam.limit}&skip=${userQueryParam.skip}`
        ),
      retry: 5,
      retryDelay: 1000,
      staleTime: 5000,
      placeholderData: keepPreviousData,
    });
  }

  return {
    limit,
    usersGroupOptions,
    todosGroupOptions,
    queryClient,
  };
}
