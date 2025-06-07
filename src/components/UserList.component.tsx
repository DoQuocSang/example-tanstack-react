import { queryOptions, useQuery } from "@tanstack/react-query";
import type { IUsersResponse } from "../model/user.interface";
import { apiGet } from "../api/http.api";
import UserItem from "./UserItem.compnent";
import LoadingMessage from "./Loading.component";
import ErrorMessage from "./Error.component";

export default function UserList() {
  const limit = 10;
  const skip = 0;

  function groupOptions() {
    return queryOptions({
      queryKey: ["users"],
      queryFn: () =>
        apiGet<IUsersResponse>(`/users?limit=${limit}&skip=${skip}`),
      select: (data) => data.users,
    });
  }

  // Queries
  const { data, error, isPending, isError } = useQuery(groupOptions());

  if (isPending) {
    return <LoadingMessage />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      {data?.map((user) => {
        return <UserItem key={user.id} user={user} />;
      })}
    </div>
  );
}
