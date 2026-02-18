import { render, screen } from "@testing-library/react";
import DocumentCard from "@/features/documents/components/DocumentCard";

describe("DocumentCard Component", () => {
  const mockDocument = {
    id: 1,
    title: "Test Document",
    category: "Testing",
    description: "This is a test document",
    fileSize: "1.5 MB",
    uploadedDate: "2025-02-18",
  };

  it("renders document card with title", () => {
    render(<DocumentCard document={mockDocument} />);
    expect(screen.getByText("Test Document")).toBeInTheDocument();
  });

  it("renders document category", () => {
    render(<DocumentCard document={mockDocument} />);
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("renders document description", () => {
    render(<DocumentCard document={mockDocument} />);
    expect(screen.getByText("This is a test document")).toBeInTheDocument();
  });

  it("renders file size", () => {
    render(<DocumentCard document={mockDocument} />);
    expect(screen.getByText("1.5 MB")).toBeInTheDocument();
  });

  it("renders download button", () => {
    render(<DocumentCard document={mockDocument} />);
    const downloadButton = screen.getByText(/Download/i);
    expect(downloadButton).toBeInTheDocument();
  });
});
