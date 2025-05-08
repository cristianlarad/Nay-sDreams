"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Helper function to generate page numbers for display (puede estar aquí o importarse si es global)
const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  pageNeighbours: number = 1
) => {
  const totalNumbers = pageNeighbours * 2 + 3; // pageNeighbours on each side + current + first + last
  const totalBlocks = totalNumbers + 2; // totalNumbers + 2 for ellipsis

  if (totalPages <= totalBlocks) {
    // No need for complex logic if total pages are few
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Determine the range of pages to display around the current page
  const startPage = Math.max(2, currentPage - pageNeighbours);
  const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

  // Always add the first page
  pages.push(1);

  // Add ellipsis if there's a gap after the first page
  if (startPage > 2) {
    pages.push("ellipsis-left");
  }

  // Add pages in the calculated range
  // Ensure startPage and endPage are within valid bounds and don't overlap with first/last page if not needed
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis if there's a gap before the last page
  if (endPage < totalPages - 1) {
    pages.push("ellipsis-right");
  }

  // Always add the last page
  pages.push(totalPages);

  // Remove duplicates that might occur if totalPages is small or pageNeighbours is large
  // This ensures each page number or ellipsis type appears only once.
  return [...new Set(pages)];
};

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching,
}: PaginationControlsProps) => {
  if (totalPages <= 1) {
    return null; // No mostrar paginación si solo hay una página o menos
  }

  const displayedPages = getPageNumbers(currentPage, totalPages);

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageClick(currentPage - 1)}
            aria-disabled={currentPage === 1 || isFetching}
            className={
              currentPage === 1 || isFetching
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {displayedPages.map((page, index) => (
          <PaginationItem key={typeof page === "string" ? page + index : page}>
            {typeof page === "string" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePageClick(page)}
                isActive={currentPage === page}
                aria-current={currentPage === page ? "page" : undefined}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageClick(currentPage + 1)}
            aria-disabled={currentPage === totalPages || isFetching}
            className={
              currentPage === totalPages || isFetching
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
