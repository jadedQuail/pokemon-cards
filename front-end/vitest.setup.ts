import { vi } from "vitest";
import { nextTick } from "vue";
import { cleanup } from "@testing-library/vue";

vi.stubGlobal("console", {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
});

export async function resetComponent() {
    await nextTick();
    cleanup();
}
