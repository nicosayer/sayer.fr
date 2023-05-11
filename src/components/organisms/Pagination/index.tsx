import { Group, Pagination as MantinePagination, Select } from "@mantine/core";
import { usePagination } from "providers/Pagination";

const Pagination = () => {
  const { page, pageSize, setPageSize, setPage, totalPages } = usePagination();

  return (
    <Group className="flex justify-center" spacing="xl">
      <MantinePagination
        value={page}
        withControls={false}
        onChange={(newPage) => {
          setPage(newPage);
        }}
        total={totalPages}
      />
      <Select
        w={128}
        value={String(pageSize)}
        onChange={(pageSize) => {
          setPageSize(Number(pageSize));
        }}
        data={[
          { label: "10 / page", value: "10" },
          { label: "20 / page", value: "20" },
          { label: "50 / page", value: "50" },
          { label: "100 / page", value: "100" },
        ]}
      />
    </Group>
  );
};

export default Pagination;
