import type { IPost } from "../../model/post.interface";
import type { IUser } from "../../model/user.interface";
import PostList from "../post/PostList.component";

interface UserItemsProps {
  user: IUser;
  posts: IPost[];
}

export default function UserItem({ user, posts }: UserItemsProps) {
  return (
    <div className="flex flex-col gap-2 text-slate-700">
      <div className="flex items-center gap-4">
        <img src={user.image} className="rounded-full w-8 h-8" />
        <p className="font-medium">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <PostList posts={posts}/>
    </div>
  );
}
