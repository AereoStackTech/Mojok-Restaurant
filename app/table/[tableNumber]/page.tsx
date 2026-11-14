import { BistroFooter } from '@/components/bistro-footer';
import { BistroHeader } from '@/components/bistro-header';
import { TableServiceView } from '@/components/table-service-view';

export default async function TableOrderPage({
  params,
}: {
  params: Promise<{ tableNumber: string }>;
}) {
  const { tableNumber } = await params;
  const cleanTableNumber = decodeURIComponent(tableNumber).slice(0, 12) || '14';

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <BistroHeader />
      <div className="flex-1">
        <TableServiceView tableNumber={cleanTableNumber} />
      </div>
      <BistroFooter />
    </div>
  );
}
