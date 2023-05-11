import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export const DEFAULT_PAGE_SIZE = 10;

interface IPaginationContext {
  page: number;
  totalPages: number;
  setPage: (value: number) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
}

const PaginationContext = createContext<IPaginationContext>({
  page: 1,
  totalPages: 1,
  setPage: () => undefined,
  pageSize: DEFAULT_PAGE_SIZE,
  setPageSize: () => undefined,
});
PaginationContext.displayName = "Pagination";

export const usePagination = () => {
  return useContext(PaginationContext);
};

function PaginationProvider({
  totalItems,
  children,
}: {
  children: ReactNode | ((data: IPaginationContext) => ReactNode);
  totalItems: number;
}) {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  const realPage = useMemo(() => {
    return Math.min(page, totalPages);
  }, [page, totalPages]);

  const context = useMemo(() => {
    return {
      page: realPage,
      totalPages,
      setPage,
      pageSize,
      setPageSize,
    };
  }, [realPage, totalPages, pageSize]);

  return (
    <PaginationContext.Provider value={context}>
      {typeof children === "function" ? children(context) : children}
    </PaginationContext.Provider>
  );
}

export default PaginationProvider;
