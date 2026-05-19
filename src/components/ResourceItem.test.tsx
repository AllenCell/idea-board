import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ResourceItem from "./ResourceItem";

describe("ResourceItem", () => {
    it("renders as an li element", () => {
        const { container } = render(<ResourceItem name="Test Resource" />);
        expect(container.firstChild?.nodeName).toBe("LI");
    });

    it("renders a link when link prop is provided", () => {
        const { getByRole } = render(
            <ResourceItem name="Test Resource" link="https://example.com" />,
        );
        const link = getByRole("link", { name: "Test Resource" });
        expect(link).toBeDefined();
        expect(link.getAttribute("href")).toBe("https://example.com");
    });

    it("renders name as plain text when no link prop", () => {
        const { getByText } = render(<ResourceItem name="Test Resource" />);
        expect(getByText("Test Resource")).toBeDefined();
    });
});
