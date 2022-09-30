import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
  Checkbox,
  useToast,
  UseToastOptions,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Head from "next/head";
type Input = {
  name: string;
  email: string;
  password: string;
  cpassword: string;
  consent: boolean;
};
interface SignUpResponse {
  status: UseToastOptions["status"];
  title: string;
  message: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
    ),
  cpassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  consent: yup
    .boolean()
    .oneOf([true], "You need to accept the terms and conditions"),
});

const SignupCard = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Input>({ resolver: yupResolver(schema) });
  const toast = useToast();

  async function onSubmit(values: Input) {
    try {
      const { cpassword, ...body } = values;
      const res = await fetch(`/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: SignUpResponse = await res.json();
      toast({
        title: data.title,
        description: data.message,
        status: data.status,
        duration: 5000,
        isClosable: true,
      });
      reset();
      router.push(
        `signin${
          router.query.callbackUrl
            ? `?callbackUrl=${router.query.callbackUrl}`
            : ""
        }`,
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Head>
        <meta name="signup" content="lorem ipsum dolor sit amet  " />
      </Head>
      <Stack
        spacing={8}
        mx={"auto"}
        w={{ md: "md" }}
        maxW={"lg"}
        py={12}
        px={6}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool
            <Link color={"blue.400"}> features</Link> ✌️
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
                id="fullName"
                isInvalid={Boolean(errors.name)}
              >
                <FormLabel>Full name</FormLabel>
                <Input type="text" {...register("name")} />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="email"
                isInvalid={Boolean(errors.email)}
              >
                <FormLabel>Email address</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isInvalid={Boolean(errors.password)}
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
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                id="cpassword"
                isInvalid={Boolean(errors.password)}
              >
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={"password"}
                    {...register("cpassword")}
                  />
                  <InputRightElement h={"full"}></InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.cpassword && errors.cpassword.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="consent"
                isInvalid={Boolean(errors.consent)}
              >
                <Checkbox {...register("consent")}>
                  Term and condition
                </Checkbox>

                <FormErrorMessage>
                  {errors.consent && errors.consent.message}
                </FormErrorMessage>
              </FormControl>
              <Stack spacing={10} pt={4}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  type="submit"
                  isLoading={isSubmitting}
                  bgGradient="linear-gradient(to right, #8e2de2, #4a00e0);"
                  bgColor={"#8e2de2"}
                  color={"white"}
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={2}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link color={"blue.400"} href="signin">
                    Sign in
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignupCard;
