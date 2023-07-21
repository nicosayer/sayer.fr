import { CloseButton, TextInput, TextInputProps } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { FC } from "react";

interface SearchTextInputProps extends TextInputProps {
  search: string;
  setSearch: (search: string) => void;
}

const SearchTextInput: FC<SearchTextInputProps> = ({
  search,
  setSearch,
  ...rest
}) => {
  return (
    <TextInput
      placeholder="Rechercher"
      variant="filled"
      icon={<IconSearch size={18} />}
      value={search}
      onChange={(event) => {
        setSearch(event.target.value);
      }}
      rightSection={
        search && (
          <CloseButton
            onClick={() => {
              setSearch("");
            }}
          />
        )
      }
      {...rest}
    />
  );
};

export default SearchTextInput;
