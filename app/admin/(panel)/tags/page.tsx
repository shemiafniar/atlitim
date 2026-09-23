import { TagManager } from "@/components/admin/tag-manager";
import { listTags } from "@/lib/repositories";

export default async function TagsAdminPage() {
  const tags = await listTags();
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">תגיות</h1>
      <div className="mt-6">
        <TagManager tags={tags} />
      </div>
    </div>
  );
}
