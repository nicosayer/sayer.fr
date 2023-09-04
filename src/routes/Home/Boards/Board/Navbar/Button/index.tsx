import { Badge, Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useAppShell } from "components/atoms/AppShell";
import usePathname from "hooks/usePathname";
import { ISecureLoginContext, useSecureLogin } from "providers/SecureLogin";
import { FC, ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IBoardContext, useBoard } from "routes/Home/Boards/Board/Provider";

interface NavbarButtonProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
  getBadgeContent?: (
    board: IBoardContext,
    secureLogin: ISecureLoginContext
  ) => ReactNode;
}

const NavbarButton: FC<NavbarButtonProps> = ({
  icon,
  color,
  label,
  to,
  getBadgeContent,
}) => {
  const board = useBoard();
  const secureLogin = useSecureLogin();

  const navigate = useNavigate();
  const { pathnames } = usePathname();
  const { closeNavbar } = useAppShell();
  const { width } = useViewportSize();

  const badgeContent = useMemo(() => {
    return getBadgeContent?.(board, secureLogin);
  }, [getBadgeContent, board, secureLogin]);

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
        {badgeContent !== undefined && (width < 768 || width >= 1200) ? (
          <Badge color={color} className="ml-auto">
            {badgeContent}
          </Badge>
        ) : undefined}
      </Group>
    </UnstyledButton>
  );
};

export default NavbarButton;
