import { createFileRoute } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/admin/blog/$id")({
  component: PostEditPage,
});

function PostEditPage() {
  const { id } = Route.useParams();
  return <PostEditor postId={id} />;
}
