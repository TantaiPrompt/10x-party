import React from "react";
import {
  ButtonGroup,
  IconButton,
  Stack,
  Text,
  Image,
  HStack,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => (
  <HStack
    as="footer"
    role="contentinfo"
    w={"full"}
    alignContent={"center"}
    justifyContent={"center"}
    py={{ base: "12", md: "16" }}
  >
    <Stack spacing={{ base: "4", md: "5" }}>
      <Stack justify="space-between" direction="row" align="center">
        <Image src="/logo.png" alt="logo" height={50} />
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            aria-label="LinkedIn"
            icon={<FaLinkedin fontSize="1.25rem" />}
          />
          <IconButton
            as="a"
            aria-label="GitHub"
            icon={<FaGithub fontSize="1.25rem" />}
          />
          <IconButton
            as="a"
            aria-label="Twitter"
            icon={<FaTwitter fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Stack>
      <Text fontSize="sm" color="subtle">
        &copy; {new Date().getFullYear()} party labs. All rights
        reserved.
      </Text>
    </Stack>
  </HStack>
);

export default Footer;
