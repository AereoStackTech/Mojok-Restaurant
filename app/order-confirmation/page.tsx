import { Suspense } from 'react';
import { BistroFooter } from '@/components/bistro-footer';
import { BistroHeader } from '@/components/bistro-header';
import { OrderConfirmationView } from '@/components/order-confirmation-view';

export default function OrderConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <BistroHeader />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl px-4 py-12">
              <div className="h-64 animate-pulse rounded-3xl border border-[#E6DFD5] bg-white" />
            </div>
          }
        >
          <OrderConfirmationView />
        </Suspense>
      </div>
      <BistroFooter />
    </div>
  );
}
