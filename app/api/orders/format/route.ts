import { NextRequest, NextResponse } from 'next/server';
import { buildConfirmedOrderTicket, OrderRequestSchema } from '@/lib/order-schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = OrderRequestSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.');
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      return NextResponse.json(
        {
          error: 'Validation failed',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const ticket = buildConfirmedOrderTicket(parsed.data);
    return NextResponse.json({ ticket }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to process order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
