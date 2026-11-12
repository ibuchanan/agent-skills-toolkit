import { mkdir, mkdtemp } from "node:fs/promises";
import { join, resolve } from "node:path";

const testTempRoot = resolve(import.meta.dir, "../../../.scratch/tests");

/** Keep repository-local test artifacts ignored even if cleanup is interrupted. */
export async function createTestTempDir(prefix: string): Promise<string> {
  await mkdir(testTempRoot, { recursive: true });
  return mkdtemp(join(testTempRoot, prefix));
}
