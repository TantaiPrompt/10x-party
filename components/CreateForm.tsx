import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Stack,
  Link,
  useToast,
} from "@chakra-ui/react";
import Router from "next/router";
import { getSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type GroupCreateInput = {
  name: string;
  limit: number;
};
const schema = yup.object().shape({
  name: yup.string().required("Title is required"),
  limit: yup
    .number()
    .typeError("Invalid input")
    .min(2, "Minimum 2")
    .required("Limit is required"),
  // .positive("Positive number only"),
});

const CreateForm: React.FC = () => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GroupCreateInput>({ resolver: yupResolver(schema) });
  async function onSubmit(values: GroupCreateInput) {
    try {
      const body = { ...values };
      const res = await fetch(`http://localhost:3000/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      toast({
        title: data.title,
        description: data.message,
        status: data.status,
        duration: 5000,
        isClosable: true,
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const securePage = async () => {
      const session = await getSession();
      if (!session) {
        signIn();
      }
    };
    securePage();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={Boolean(errors.name)} paddingBottom={4}>
        <FormLabel htmlFor="name">Party Name</FormLabel>
        <Input id="name" placeholder="name" {...register("name")} />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={Boolean(errors.limit)}>
        <FormLabel htmlFor="memberLimit">Member Limit</FormLabel>
        <Input
          id="memberLimit"
          placeholder="10"
          type="number"
          defaultValue={2}
          {...register("limit")}
        />
        <FormErrorMessage>
          {errors.limit && errors.limit.message}
        </FormErrorMessage>
      </FormControl>

      <Stack spacing={4} textAlign={"center"}>
        <Button
          bgGradient="linear-gradient(to right, #8e2de2, #4a00e0);"
          bgColor={"#8e2de2"}
          mt={4}
          color={"white"}
          type="submit"
          _hover={{
            opacity: 0.8,
          }}
          _focus={{
            border: "none",
          }}
          isLoading={isSubmitting}
        >
          Create
        </Button>
        <a onClick={() => Router.push("/")}>
          or
          <Link color={"blue.400"}> Cancel</Link>
        </a>
      </Stack>
    </form>
  );
};

export default CreateForm;
