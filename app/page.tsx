import { DeckClient } from "@/components/deck/DeckClient";
import { getCategoryBySlug, getCategorySummaries } from "@/lib/serverData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getCategorySummaries();

  if (categories.length === 0) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[#0b0d0f] text-[#f5f4f2] font-body text-lg px-8 text-center">
        No categories yet. Log into /admin to create the first one.
      </main>
    );
  }

  const initialSlug = categories[0].slug;
  const initialCategory = await getCategoryBySlug(initialSlug);

  if (!initialCategory) {
    return null;
  }

  return <DeckClient categories={categories} initialSlug={initialSlug} initialCategory={initialCategory} />;
}
