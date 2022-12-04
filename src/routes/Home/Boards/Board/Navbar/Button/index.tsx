import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useAppShell } from "components/atoms/AppShell";
import usePathname from "hooks/usePathname";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarButtonProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
}

const NavbarButton: FC<NavbarButtonProps> = ({ icon, color, label, to }) => {
  const navigate = useNavigate();
  const { last } = usePathname();
  const { closeNavbar } = useAppShell();
  const isActive = useMemo(() => {
    return last === to;
  }, [last, to]);

  return (
    <UnstyledButton
      onClick={() => {
        navigate(to);
        closeNavbar();
      }}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: isActive
          ? theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0]
          : undefined,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

export default NavbarButton;
