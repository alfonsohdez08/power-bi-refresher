import React from "react";
import _ from "lodash";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";

function Button({
  placeholder,
  onClick,
  isActive,
  ...props
}: {
  placeholder: string;
  onClick: any;
  isActive: boolean;
  [key: string]: any;
}) {
  const activeCssClasses = isActive
    ? "bg-indigo-50 border-indigo-500 text-indigo-600 z-10"
    : "border-gray-300 text-gray-700 hover:bg-gray-200";

  return (
    <button
      onClick={onClick}
      type="button"
      className={
        "relative inline-flex items-center px-4 py-2 border text-sm font-medium " +
        activeCssClasses
      }
      {...props}
    >
      {placeholder}
    </button>
  );
}

function ButtonIcon({
  placeholder,
  onClick,
  disabled = false,
  className = "",
  ...props
}: {
  placeholder: string | JSX.Element;
  onClick: any;
  disabled: boolean;
  className?: string;
  [key: string]: any;
}) {
  let hoverCssClass = "hover:bg-gray-200",
    cursorCssClass = "";
  if (disabled) {
    hoverCssClass = "hover:bg-transparent";
    cursorCssClass = "cursor-not-allowed";
  }

  const cssClasses = `${className} ${hoverCssClass} ${cursorCssClass}`;

  return (
    <button
      onClick={onClick}
      type="button"
      className={
        "relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium text-gray-700 " +
        cssClasses
      }
      {...props}
    >
      {placeholder}
    </button>
  );
}

export default function PaginationBar({
  currentPage,
  totalPages,
  pagesPerWindow,
  onSelectPage,
}: {
  currentPage: number;
  totalPages: number;
  pagesPerWindow: number;
  onSelectPage: (newPage: number) => void;
}) {
  const isPreviousPageButtonDisabled = () => {
    return currentPage - 1 <= 0;
  };

  const isNextPageButtonDisabled = () => {
    return currentPage + 1 > totalPages;
  };

  const isPreviousWindowPageButtonDisabled = () => {
    const pageWindow = Math.floor((currentPage - 1) / pagesPerWindow);

    return pageWindow <= 0;
  };

  const isNextWindowPageButtonDisabled = () => {
    const pageWindow = Math.floor((currentPage - 1) / pagesPerWindow);

    return pageWindow * pagesPerWindow + pagesPerWindow >= totalPages;
  };

  const nextPage = () => {
    if (!isNextPageButtonDisabled()) {
      onSelectPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (!isPreviousPageButtonDisabled()) {
      onSelectPage(currentPage - 1);
    }
  };

  const nextWindowPage = () => {
    if (!isNextWindowPageButtonDisabled()) {
      const currentWindowPage = (currentPage - 1) / pagesPerWindow + 1;
      onSelectPage(currentWindowPage * pagesPerWindow + 1);
    }
  };

  const previousWindowPage = () => {
    if (!isPreviousWindowPageButtonDisabled()) {
      const pageWindow = Math.floor((currentPage - 1) / pagesPerWindow - 1);
      onSelectPage(pageWindow * pagesPerWindow + 1);
    }
  };

  const renderPreviousPageButton = () => (
    <ButtonIcon
      placeholder={
        <>
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </>
      }
      onClick={() => previousPage()}
      disabled={isPreviousPageButtonDisabled()}
    />
  );

  const renderNextPageButton = () => (
    <ButtonIcon
      placeholder={
        <>
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </>
      }
      onClick={() => nextPage()}
      disabled={isNextPageButtonDisabled()}
    />
  );

  const renderPreviousWindowOfPages = () => (
    <ButtonIcon
      placeholder={
        <>
          <span className="sr-only">Previous Section</span>
          <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
        </>
      }
      onClick={() => previousWindowPage()}
      className="rounded-l-lg"
      disabled={isPreviousWindowPageButtonDisabled()}
    />
  );

  const renderNextWindowOfPages = () => (
    <ButtonIcon
      placeholder={
        <>
          <span className="sr-only">Next Section</span>
          <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
        </>
      }
      onClick={() => nextWindowPage()}
      className="rounded-r-lg"
      disabled={isNextWindowPageButtonDisabled()}
    />
  );

  const renderCurrentWindowOfPages = () => {
    const pages = [];

    const currentPageWindow = Math.floor((currentPage - 1) / pagesPerWindow);

    let startPageWindow = (currentPageWindow * pagesPerWindow) + 1;
    
    let endPageWindow = currentPageWindow * pagesPerWindow + pagesPerWindow;
    if (endPageWindow > totalPages) {
      endPageWindow = totalPages;
    }

    for (; startPageWindow <= endPageWindow; startPageWindow++) {
      const page = startPageWindow;
      pages.push(
        <Button
          key={page.toString()}
          placeholder={page.toString()}
          onClick={() => onSelectPage(page)}
          isActive={page === currentPage}
        />
      );
    }

    return pages;
  };

  return (
    <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
      {renderPreviousWindowOfPages()}
      {renderPreviousPageButton()}
      {renderCurrentWindowOfPages()}
      {renderNextPageButton()}
      {renderNextWindowOfPages()}
    </div>
  );
}
