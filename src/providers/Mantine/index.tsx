import "dayjs/locale/fr";
import { PropsWithChildren } from "react";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider as MantineProviderComponent,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";

const MantineProvider = ({ children }: PropsWithChildren) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProviderComponent
        theme={{
          colorScheme,
          components: {
            Input: {
              classNames: {
                input: "placeholder:text-gray-400",
              },
            },
            TextInput: {
              classNames: {
                input: "placeholder:text-gray-400",
              },
            },
            PasswordInput: {
              classNames: {
                innerInput: "placeholder:text-gray-400",
              },
            },
            Select: {
              classNames: {
                input: "placeholder:text-gray-400",
              },
            },
            MultiSelect: {
              classNames: {
                input: "placeholder:text-gray-400",
              },
            },
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <DatesProvider settings={{ locale: "fr" }}>
          <Notifications />

          {children}
        </DatesProvider>
      </MantineProviderComponent>
    </ColorSchemeProvider>
  );
};

export default MantineProvider;
