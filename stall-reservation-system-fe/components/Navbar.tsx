"use client";

import { Flex, Text, Button, Box, DropdownMenu, Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PersonIcon } from "@radix-ui/react-icons";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Box style={{ borderBottom: '1px solid var(--gray-5)', padding: '1rem' }}>
      <Flex justify="between" align="center">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text size="5" weight="bold">Bookfair MS</Text>
        </Link>

        <Flex gap="4" align="center">
          <Link href="/reservations">
            <Button variant={pathname === '/reservations' ? 'solid' : 'ghost'}>
              Reservations
            </Button>
          </Link>
          
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant={pathname === '/login' ? 'solid' : 'ghost'}>
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button variant={pathname === '/register' ? 'solid' : 'ghost'}>
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" style={{ gap: '8px' }}>
                  <PersonIcon />
                  {user?.fullName || user?.username}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>My Account</DropdownMenu.Label>
                <DropdownMenu.Item disabled>{user?.email}</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red" onClick={logout}>
                  Log out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}