import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
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
  const isActive = useMemo(() => {
    return last === to;
  }, [last, to]);

  return (
    <UnstyledButton
      onClick={() => {
        navigate(to);
      }}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon
          color={color}
          variant="light"
          className={`${isActive ? "" : "bg-transparent"}`}
        >
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
};

export default NavbarButton;
