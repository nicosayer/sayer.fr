import { Badge, Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useAppShell } from "components/atoms/AppShell";
import usePathname from "hooks/usePathname";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IBoardContext, useBoard } from "../../Provider";

interface NavbarButtonProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
  count?: (board: IBoardContext) => number;
}

const NavbarButton: FC<NavbarButtonProps> = ({
  icon,
  color,
  label,
  to,
  count,
}) => {
  const navigate = useNavigate();
  const { pathnames } = usePathname();
  const { closeNavbar } = useAppShell();
  const board = useBoard();

  const badgeCount = useMemo(() => {
    return count?.(board);
  }, [count, board]);

  const isActive = useMemo(() => {
    return pathnames[2] === to;
  }, [pathnames, to]);

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
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
          : undefined,
        "&:hover": {
          backgroundColor: isActive
            ? ""
            : theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        },
      })}
    >
      <Group noWrap>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
        {badgeCount ? (
          <Badge color={color} className="ml-auto">
            {badgeCount > 9 ? "+" : badgeCount}
          </Badge>
        ) : undefined}
      </Group>
    </UnstyledButton>
  );
};

export default NavbarButton;
