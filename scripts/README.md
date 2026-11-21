# Scripts Directory Overview

This directory contains build-time generation utilities and pre/post-deployment verification scripts for the AptiVerse platform.

## Utilities

| Script | Runtime | Description |
|---|---|---|
| `verify_integrity.cjs` | Node.js | Audits project file presence, game session hooks, all 8 challenge exports, and route registrations. |
| `verify_pre_deployment.cjs` | Node.js | Validates environment variables, SQL migration syntax, bundle configurations, and static assets before deployment. |
| `verify_trusted_backend.cjs` | Node.js | Runs live backend RPC anticheat assertions and token validation against Supabase. |
| `verify_deployed_db.cjs` | Node.js | Audits database views, indexes, RLS policies, and aggregated leaderboard throughput. |
| `generate_levels.cjs` | Node.js | Procedurally generates level configurations for spatial and pattern games. |
| `generate_rc.cjs` | Node.js | Prepares and validates Reading Comprehension text passages and question banks. |
| `pregen_motion.ts` | Node.js / ts-node | Computes and caches verified topological motion planning level states. |

## Running Verifications

```bash
# Integrity Audit
node scripts/verify_integrity.cjs

# Pre-deployment Checklist
node scripts/verify_pre_deployment.cjs

# Production Database Health Check (requires --env-file=.env)
node --env-file=.env scripts/verify_deployed_db.cjs
```
