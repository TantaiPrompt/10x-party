import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { GroupInfo } from "../components/Group";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import GroupPagination from "../components/GroupPagination";
interface GroupRes {
  groups: GroupInfo[];
  totalGroup: number;
  totalPage: number;
}

export const getServerSideProps: GetServerSideProps = async (
  context,
) => {
  const page = context.query.page ? Number(context.query.page) : 1;
  const res = await fetch(
    `http://localhost:3000/api/groups?page=${page}`,
  );
  const data: GroupRes = await res.json();
  return {
    props: { ...data },
  };
};

type Props = {
  groups: GroupInfo[];
  totalGroup: number;
  totalPage: number;
};

const Party: React.FC<Props> = (props) => {
  return (
    <Layout>
      <Box>
        <Heading
          fontWeight="extrabold"
          marginY={8}
          textAlign={"center"}
        >
          <Text fontSize={"lg"} color={"black.200"}>
            Lorem ipsum dolor sit amet. {" "}
            <Link color={"blue.400"}>peace</Link> ✌️
          </Text>
          <Text
            bgGradient="linear(to-l, #831ee7, #f31fb3)"
            bgClip="text"
            bgColor={"#8e2de2"}
          >
            Be silly. Be fun. Be crazy!!
          </Text>
        </Heading>
        <GroupPagination
          groups={props.groups}
          totalGroup={props.totalGroup}
        />
      </Box>
    </Layout>
  );
};

export default Party;
