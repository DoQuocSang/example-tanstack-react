import { NavLink, Outlet } from "react-router-dom";
import useTodoQuery from "../../hooks/useCustomQuery.hook";

export default function Layout() {
  function onClickNavLink(isActive: boolean) {
    const baseClassName = "px-4 py-2 rounded-md font-bold uppercase ";
    const ativeClassName = "bg-teal-500 text-white";
    const inativeClassName = "text-teal-500 hover:bg-teal-100";

    if (isActive) {
      return `${baseClassName} ${ativeClassName}`;
    } else {
      return `${baseClassName} ${inativeClassName}`;
    }
  }

  const { queryClient, todosGroupOptions, usersGroupOptions } = useTodoQuery();

  queryClient.prefetchQuery(todosGroupOptions());

  queryClient.prefetchQuery(usersGroupOptions());

  return (
    <div className="flex flex-col gap-6 items-center py-12 px-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-center bg-white rounded-md text-xl uppercase font-bold">
        <NavLink
          to={"/users"}
          className={({ isActive }) => onClickNavLink(isActive)}
        >
          User List
        </NavLink>

        <NavLink
          to={"/todos"}
          className={({ isActive }) => onClickNavLink(isActive)}
        >
          Todo List
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
