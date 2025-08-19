# Cancellation Flow

This repo implements a guided subscription cancellation flow using Next.js (App Router) and Supabase. The UI is a modal sequence that captures intent, runs an A/B downsell experiment, and records structured reasons.

## Architecture Decisions
### Stack & rationale

- Next.js App Router for colocated UI and Route Handlers, enabling fast SPA UX with server-only logic.
- TypeScript + Zod for strong typing and request-body validation.
- Supabase for data; @supabase/supabase-js is used only in server code with a service-role key.

### Flow model (state machine)
flowchart TD
  entry[[User clicks "Cancel Migrate Mate"]] --> bootstrap[/POST /api/cancel/bootstrap/]
  bootstrap --> cancel[Cancel (chooser)]

  cancel -- Found job --> congrats[Congrats]
  congrats --> reason[Reason]
  reason --> visa[Visa]
  visa --> done[Done ✅]

  cancel -- Still looking --> ab{Variant from bootstrap}
  ab -- A --> usage[Usage Survey]
  ab -- B --> downsell[Downsell Offer]
  downsell -- Accept --> downsellAccepted[Offer Accepted ✅]
  downsell -- Decline --> usage
  usage --> reasonsB[Reasons]
  reasonsB --> finalCancelled[Final Cancelled ✅]

### Server contracts

- POST /api/cancel/bootstrap
Body: { subscriptionId: uuid }
Returns: { cancellationId, variant: 'A'|'B', priceCents }
Idempotent: reuses latest cancellations row for the same user+subscription and sets subscriptions.status = 'pending_cancellation' if needed.
- POST /api/cancel/reason
Body: { cancellationId: uuid, reasonKey: string, details?: string, acceptedDownsell?: boolean }
Persists structured reasons and (optionally) downsell acceptance.

### Minimal schema
- subscriptions(id, user_id, monthly_price, status, …)
- cancellations(id, user_id, subscription_id, downsell_variant, created_at, …)
- cancellation_reasons(cancellation_id, reason_key, details, accepted_downsell, created_at)

##Security Implementation

### Secrets & config
- Secrets live in .env.local (ignored by Git).
Public values use NEXT_PUBLIC_*; server-only values (e.g., SUPABASE_SERVICE_ROLE) never appear in the browser.
- Supabase admin client is created only in Route Handlers:
createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
### Authorization & ownership
- bootstrap: verifies the subscriptionId exists and belongs to the current user (local dev uses MOCK_USER_ID). Returns 403 or 404 if not.
- reason: verifies the cancellationId is owned by the same user before inserting a reason.
### Input validation & errors
- All POST bodies are validated with Zod → invalid requests return 400 with a clear error.
- Explicit 403/404/500 branches make failures debuggable; the client never sees sensitive keys or SQL errors.
### CSRF & boundaries
- Client can send an x-csrf header read from a cookie; server can enforce it behind middleware in production.
- The browser talks only to our API; all database mutations happen server-side.

## A/B Testing Approach
### Deterministic assignment
Users are split 50/50 by a stable hash of userId:
const variant = (hash(userId) % 2 === 0) ? 'A' : 'B';
This ensures a consistent experience per user across sessions and reproducible metrics.
### Exposure
/api/cancel/bootstrap returns the chosen variant; the UI branches:
Variant A: no upfront offer → usage survey first.
Variant B: show downsell offer; on decline, proceed to usage → reasonsB.
### Measurement
Reasons are saved with a canonical reasonKey plus free-text details.
Downsell outcomes captured via acceptedDownsell.
The Step-1 survey posts reasonKey: 'found_job_survey' with rolled-up counts in details.
### Integrity & idempotency
Deterministic assignment + idempotent bootstrap prevent re-randomization and duplicate cancellation rows.
All writes are bound to { user_id, subscription_id }, avoiding cross-account leakage.

## .env.local
### --- Supabase (local) ---
- NEXT_PUBLIC_SUPABASE_URL = http://127.0.0.1:54321
- NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
- SUPABASE_SERVICE_ROLE = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
- SUPABASE_JWT_SECRET = super-secret-jwt-token-with-at-least-32-characters-long

### mock user used by the flow (matches seed.sql/user we discussed)
- MOCK_USER_ID = 550e8400-e29b-41d4-a716-446655440001
