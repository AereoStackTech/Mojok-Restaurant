import { BistroFooter } from '@/components/bistro-footer';
import { BistroHeader } from '@/components/bistro-header';
import { MenuHub } from '@/components/menu-hub';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BistroHeader />
      <div className="flex-1">
        <MenuHub />
      </div>
      <BistroFooter />
    </div>
  );
}
