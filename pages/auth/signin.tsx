import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { signIn, useSession } from "next-auth/react";
import { logger } from "@lib/logger";
import { useRouter } from "next/router";
import Head from "next/head";

//icons

export default function SimpleCard() {
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen: isOpenCollapse, onToggle: onToggleCollapse } =
    useDisclosure();

  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  let defaultBody = {
    grant_type: "",
    username: "asdf@gmail.com",
    password: "asdf",
    scope: "",
    client_id: "",
    client_secret: "",
  };

  async function onSubmit(values) {
    try {
      const body = { ...defaultBody, ...values };
      let res = await signIn("credentials", {
        ...body,
        callbackUrl: router.query.callbackUrl,
      });
    } catch (error) {
      logger.error(error);
    }
  }
  if (status === "authenticated") {
    router.push("/", {
      query: {
        callbackUrl: router.query.callbackUrl,
      },
    });
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Head>
        <meta
          name="sigin"
          content="lorem ipsum dolor sit amet  "
        />
      </Head>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Image src="/logo.png" alt="logo" height={20} />
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool{" "}
            <Link color={"blue.400"}>features</Link> ??????
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl
                id="email"
                isInvalid={Boolean(router.query.error)}
                isRequired
              >
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register("username")} />
              </FormControl>
              <FormControl
                id="password"
                isRequired
                isInvalid={Boolean(router.query.error)}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      _hover={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                      onClick={() =>
                        setShowPassword(
                          (showPassword) => !showPassword,
                        )
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {router.query.error &&
                  router.query.error === "CredentialsSignin" && (
                    <FormErrorMessage>
                      Invalid credentials
                    </FormErrorMessage>
                  )}
              </FormControl>
              <Stack spacing={4}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                ></Stack>
                <Button
                  isLoading={isSubmitting}
                  loadingText="Signing in..."
                  bgGradient="linear-gradient(to right, #8e2de2, #4a00e0);"
                  bgColor={"#8e2de2"}
                  color={"white"}
                  type="submit"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  Sign in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Not a user yet?{" "}
                  <Link
                    color={"blue.400"}
                    href={`signup${
                      router.query.callbackUrl
                        ? `?callbackUrl=${router.query.callbackUrl}`
                        : ""
                    }`}
                  >
                    Register
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
          {/* </Collapse> */}
        </Box>
      </Stack>
    </Flex>
  );
}
