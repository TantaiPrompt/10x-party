import { FC } from "react";
import Layout from "../components/Layout";
import CreateForm from "@components/CreateForm";

import {
  Box,
  useColorModeValue,
  Stack,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";

const CreateGroup: FC = () => {
  return (
    <Layout>
      <Head>
        <meta
          name="create group"
          content="lorem ipsum dolor sit amet  "
        />
      </Head>
      <Flex minH={"100vh"} justify={"center"} rounded={"lg"}>
        <Stack
          w={["80%", "80%", "40%", "40%"]}
          py={12}
          px={2}
          spacing={10}
        >
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Create Party's
            </Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy with your
              <Link color={"blue.400"}> frens</Link> 🚀
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            width="100%"
            boxShadow={"lg"}
            p={8}
            border="1px solid"
            borderColor="gray.200"
          >
            <CreateForm />
          </Box>
        </Stack>
      </Flex>
    </Layout>
  );
};

export default CreateGroup;
