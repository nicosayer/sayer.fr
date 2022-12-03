import { PropsWithChildren } from "react";

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider as MantineProviderComponent,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";

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
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          {children}
        </ModalsProvider>
      </MantineProviderComponent>
    </ColorSchemeProvider>
  );
};

export default MantineProvider;
