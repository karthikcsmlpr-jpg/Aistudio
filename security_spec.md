# Security Specification - SentinelX

## 1. Data Invariants
- A threat must have a valid severity level.
- An incident must be linked to an existing threat.
- Only admins and analysts can update threat status.
- Only admins can manage users (roles).
- Incident status transitions must be logical (e.g., from resolved you can't go back to open without a reason, though not strictly enforced in rules, we prevent shadow fields).
- Users can only read their own private data if any, but profile roles are read-only for users themselves.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Self-Promotion**: User trying to update their own `role` to 'admin'.
2. **Shadow Threat**: Creating a threat with extra fields like `isFalsePositive: true` if not in schema.
3. **Ghost Incident**: Creating an incident referencing a non-existent `threatId`.
4. **Invalid IP**: Source IP with 2MB of junk data.
5. **Unauthorized Resolution**: Viewer role attempting to resolve an incident.
6. **Immutable Tampering**: Changing `createdAt` on an incident.
7. **Role Spoofing**: Creating a user profile with `role: 'admin'` during signup.
8. **Stat Injection**: Injecting a massive string into a severity field.
9. **Log Deletion**: Attempting to delete log events (logs should be append-only).
10. **Device Hijack**: Changing a device's OS field via client SDK.
11. **Malicious ID**: Creating a threat with a document ID containing path injection characters.
12. **Blanket Query**: Authenticated user trying to list all users' PII (if any).

## 3. Test Runner (Mock Logic)
- `test('admins can do everything')`
- `test('viewers cannot write')`
- `test('analysts can manage incidents but not users')`
