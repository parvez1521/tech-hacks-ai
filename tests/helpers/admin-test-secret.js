// Test-only setup: admin access now requires an explicit
// ADMIN_SECRET in every environment, so tests that exercise the
// admin path inject a throwaway value via the environment before
// importing the store modules. Import this module first.
// This is a dummy fixture value, not a real credential.
if (!process.env.ADMIN_SECRET) {
  process.env.ADMIN_SECRET = 'test-only-admin-secret-fixture';
}
export const TEST_ADMIN_SECRET = process.env.ADMIN_SECRET;
