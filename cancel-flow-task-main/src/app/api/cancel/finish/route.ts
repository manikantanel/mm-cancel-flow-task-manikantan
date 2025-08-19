// app/api/cancel/finish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

const Body = z.object({
  cancellationId: z.string().uuid()
});

export async function POST(req: NextRequest) {
  try {
    const { cancellationId } = Body.parse(await req.json());
    const userId = process.env.MOCK_USER_ID!;

    // Look up the subscription we’re finishing
    const { data: cancelRow, error: cErr } = await supabaseAdmin
      .from('cancellations')
      .select('subscription_id')
      .eq('id', cancellationId)
      .eq('user_id', userId)
      .single();

    if (cErr || !cancelRow) {
      return NextResponse.json({ error: 'cancellation_not_found' }, { status: 404 });
    }

    // Mark as cancelled (or you can keep pending until period end)
    const { error: sErr } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', cancelRow.subscription_id)
      .eq('user_id', userId);

    if (sErr) {
      return NextResponse.json({ error: 'finish_failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'bad_request' }, { status: 400 });
  }
}
