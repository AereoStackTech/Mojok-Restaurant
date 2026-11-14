import { notFound } from 'next/navigation';
import { BistroFooter } from '@/components/bistro-footer';
import { BistroHeader } from '@/components/bistro-header';
import { DishDetailView } from '@/components/dish-detail-view';
import { getDishBySlug, MENU_ITEMS } from '@/lib/menu-data';

export function generateStaticParams() {
  return MENU_ITEMS.map((item) => ({ slug: item.slug }));
}

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dish = getDishBySlug(slug);

  if (!dish) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <BistroHeader />
      <div className="flex-1">
        <DishDetailView dish={dish} />
      </div>
      <BistroFooter />
    </div>
  );
}
