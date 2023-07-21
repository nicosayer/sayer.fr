import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("s") ?? "");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  useEffect(() => {
    setSearchParams(debouncedSearch ? { s: debouncedSearch } : undefined);
  }, [debouncedSearch, setSearchParams]);

  return useMemo(() => {
    return {
      search,
      setSearch,
      debouncedSearch,
      emptySearch: () => {
        setSearch("");
      },
    };
  }, [search, setSearch, debouncedSearch]);
};

export default useSearch;
