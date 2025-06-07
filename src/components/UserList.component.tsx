import { queryOptions, useQuery } from "@tanstack/react-query";
import type { IUsersResponse } from "../model/user.interface";
import { apiGet } from "../api/http.api";
import UserItem from "./UserItem.compnent";
import { type Status } from "./QueryStatusIndicator.component";
import QueryStatusIndicator from "./QueryStatusIndicator.component";

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
  const { data, error, status, isFetching } = useQuery(groupOptions());
  return (
    <>
      <QueryStatusIndicator
        error={error}
        isFetching={isFetching}
        status={status as Status}
      />
      <div className="flex flex-col gap-6 max-w-xl">
        {data?.map((user) => {
          return <UserItem key={user.id} user={user} />;
        })}
      </div>
    </>
  );
}
