// app/api/cancel/reason/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

const Body = z.object({
  cancellationId: z.string().uuid(),
  reasonKey: z.string().min(1),
  details: z.string().optional(),
  acceptedDownsell: z.boolean().optional()
});

export async function POST(req: NextRequest) {
  try {
    const { cancellationId, reasonKey, details, acceptedDownsell } = Body.parse(
      await req.json()
    );
    const userId = process.env.MOCK_USER_ID!;

    const { error } = await supabaseAdmin
      .from('cancellations')
      .update({
        reason: details ? `${reasonKey} :: ${details}` : reasonKey,
        accepted_downsell: acceptedDownsell ?? false
      })
      .eq('id', cancellationId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'bad_request' }, { status: 400 });
  }
}
