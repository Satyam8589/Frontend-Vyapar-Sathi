import { render, screen } from "@testing-library/react";
import DocumentsHeader from "@/features/documents/components/DocumentsHeader";

describe("DocumentsHeader Component", () => {
  it("renders the documents header with title", () => {
    render(<DocumentsHeader />);
    const heading = screen.getByText("Documents");
    expect(heading).toBeInTheDocument();
  });

  it("renders the header description", () => {
    render(<DocumentsHeader />);
    const description = screen.getByText(
      /Access guides, tutorials, and documentation/i
    );
    expect(description).toBeInTheDocument();
  });

  it("has the correct styling classes", () => {
    const { container } = render(<DocumentsHeader />);
    const headerDiv = container.querySelector(".bg-gradient-to-r");
    expect(headerDiv).toBeInTheDocument();
  });
});
