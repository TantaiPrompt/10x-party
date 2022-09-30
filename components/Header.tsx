import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Image,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { logger } from "@lib/logger";
import { Button, HStack } from "@chakra-ui/react";
import Head from "next/head";

const Header: React.FC = () => {
  const avatarSize = useBreakpointValue({ base: "md", md: "md" });

  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();
  // logger.debug(session);
  let left = (
    <HStack>
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          <Image src="/logo.png" alt="logo" height={10} />
        </a>
      </Link>
    </HStack>
  );

  let right = null;

  if (status == "loading") {
    left = (
      <div>
        <Link href="/">
          <a data-active={isActive("/")}>Feed</a>
        </Link>
      </div>
    );
    right = (
      <div>
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <HStack>
        <Button onClick={() => signIn()}>Log in</Button>
      </HStack>
    );
  }

  if (session) {
    left = (
      <HStack>
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            <Image src="/logo.png" alt="logo" height={10} />
          </a>
        </Link>
      </HStack>
    );
    right = (
      <HStack>
        <Link href="/createGroup" passHref>
          <Button
            bgColor={"gray.200"}
            display={["none", "none", "flex", "flex"]}
          >
            Create Party
          </Button>
        </Link>
        <Link href="/createGroup" passHref>
          <Button
            bgColor={"gray.200"}
            size={"md"}
            rounded={"xl"}
            display={["flex", "flex", "none", "none"]}
          >
            +
          </Button>
        </Link>

        <Menu>
          <MenuButton
            borderRadius={28}
            border="4px"
            borderColor="gray.200"
            _hover={{ borderColor: "purple.600" }}
          >
            <Avatar size={avatarSize} name={session.user.name} />
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem
                onClick={() => {
                  logger.debug("callbackUrl: ", router.basePath);
                  signOut();
                }}
              >
                Log out
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </HStack>
    );
  }

  return (
    <nav>
      <Head>
        <title>PartyClub - 10X</title>
        <meta name="description" content="We're Gonna Make It" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HStack
        p={5}
        justify="space-between"
        borderBottom="1px gray.200"
        shadow="md"
      >
        {left}
        {right}
      </HStack>
    </nav>
  );
};

export default Header;
