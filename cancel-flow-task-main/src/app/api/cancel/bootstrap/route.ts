// app/api/cancel/bootstrap/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

const Body = z.object({
  subscriptionId: z.string().uuid()
});

function chooseVariantDeterministic(userId: string): 'A' | 'B' {
  // Stable 50/50 based on userId hash (so we never re-randomize)
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 33 + userId.charCodeAt(i)) >>> 0;
  return hash % 2 === 0 ? 'A' : 'B';
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { subscriptionId } = Body.parse(json);

    // In real life, use the authenticated user; for local we use the MOCK_USER_ID
    const userId = process.env.MOCK_USER_ID!;

    // Get subscription
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, monthly_price, status')
      .eq('id', subscriptionId)
      .single();

    if (subErr || !sub) {
      return NextResponse.json({ error: 'subscription_not_found' }, { status: 404 });
    }
    if (sub.user_id !== userId) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    // Reuse existing cancellation (if any)
    const { data: existing, error: exErr } = await supabaseAdmin
      .from('cancellations')
      .select('id, downsell_variant')
      .eq('subscription_id', subscriptionId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const variant: 'A' | 'B' =
      existing?.downsell_variant ?? chooseVariantDeterministic(userId);

    let cancellationId = existing?.id;
    if (!cancellationId) {
      const { data: inserted, error: insErr } = await supabaseAdmin
        .from('cancellations')
        .insert({
          user_id: userId,
          subscription_id: subscriptionId,
          downsell_variant: variant
        })
        .select('id')
        .single();

      if (insErr || !inserted) {
        return NextResponse.json({ error: 'create_cancellation_failed' }, { status: 500 });
      }
      cancellationId = inserted.id;
    }

    // Put subscription into pending_cancellation (idempotent)
    if (sub.status !== 'pending_cancellation') {
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'pending_cancellation' })
        .eq('id', subscriptionId)
        .eq('user_id', userId);
    }

    return NextResponse.json({
      cancellationId,
      variant,
      priceCents: sub.monthly_price
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'bad_request' }, { status: 400 });
  }
}
