"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    current: number;
    max: number;
    onChange?: (page: number) => void;
}

export default function Pagination({
    current,
    max,
    onChange
}: PaginationProps) {
    const handlePrev = () => {
        if (current === 1) return;
        onChange?.(current - 2);
    };

    const handleNext = () => {
        if (current === max) return;
        onChange?.(current);
    };

    if (!max) return null;

    return (
        <div
            className={`mt-4 flex w-full items-center justify-center ${max === 1 ? "invisible" : ""}`}
        >
            <nav
                aria-label="Pagination"
                className="flex items-center gap-1 text-xs text-gray-600 md:text-sm"
            >
                <button
                    className="mr-2 rounded-md p-2 hover:bg-gray-100 focus:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-inherit md:mr-4"
                    disabled={current === 1}
                    onClick={handlePrev}
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: max }).map((_, index) => {
                    const page = index + 1;
                    if (
                        page === max ||
                        page === 1 ||
                        (page >= current - 2 && page <= current + 2)
                    )
                        return (
                            <button
                                key={`page-${index}`}
                                className={`rounded-md px-4 py-1 font-medium hover:bg-gray-100 focus:bg-gray-100 ${page === current ? "bg-slate-100" : ""}`}
                                onClick={() => onChange?.(index)}
                            >
                                {page}
                            </button>
                        );

                    if (page == current - 3 || page === current + 3)
                        return (
                            <button
                                key={`more-page-${index}`}
                                className="rounded-md px-4 py-1"
                                disabled
                            >
                                ...
                            </button>
                        );
                    return null;
                })}
                <button
                    className="ml-2 rounded-md p-2 hover:bg-gray-100 focus:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-inherit md:ml-4"
                    disabled={current === max}
                    onClick={handleNext}
                    aria-label="Next"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </nav>
        </div>
    );
}
