import type { Metadata } from "next";
import { AddBusinessForm } from "@/components/forms/add-business-form";
import { listCategories, listSubcategories } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "הוספת עסק",
  description: "הוסיפו עסק לעתלית. הפרטים נבדקים לפני הפרסום.",
};

export default async function AddBusinessPage() {
  const [categories, subcategories] = await Promise.all([listCategories(false), listSubcategories(false)]);
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <p className="text-sm font-bold text-clay">לעסקים בעתלית</p>
      <h1 className="mt-2 font-display text-4xl font-bold">הוסיפו את העסק</h1>
      <p className="mt-3 text-base leading-7 text-muted">
        מלאו כמה פרטים. העסק לא יפורסם אוטומטית — נעבור עליו לפני שהוא מופיע לתושבים.
      </p>
      <div className="mt-6">
        <AddBusinessForm categories={categories} subcategories={subcategories} />
      </div>
    </div>
  );
}
