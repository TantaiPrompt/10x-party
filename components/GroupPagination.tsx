import React from "react";
import { Text, SimpleGrid, Box } from "@chakra-ui/react";
import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from "@ajna/pagination";
import Group, { GroupInfo } from "./Group";
// import Router from "next/router";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (email: string) =>
  fetch(`/api/users?email=${email}`).then((res) => res.json());

const GroupPagination: React.FC<{
  groups: GroupInfo[];
  totalGroup: number;
}> = ({ groups, totalGroup }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: user } = useSWR(session?.user.email, fetcher);

  //pagination setup
  const outerLimit = 1;
  const innerLimit = 1;

  const { pages, pagesCount, currentPage, setCurrentPage } =
    usePagination({
      total: totalGroup,
      limits: {
        outer: outerLimit,
        inner: innerLimit,
      },
      initialState: {
        pageSize: 20,
        currentPage: 1,
      },
    });

  // handlers
  const handlePageChange = (nextPage: number): void => {
    // -> request new data using the page number
    setCurrentPage(nextPage);
    router.push("/?page=" + nextPage);
  };

  return (
    <>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={5}>
        {groups.map((group: GroupInfo) => (
          <Box
            key={group.id}
            p={5}
            height="100%"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow={"md"}
            rounded={"xl"}
          >
            <Group
              groupInfo={group}
              currentPage={currentPage}
              userId={user?.id}
            />
          </Box>
        ))}
      </SimpleGrid>
      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      >
        <PaginationContainer align="center" justify="center" p={4}>
          <PaginationPrevious
            display={["none", "none", "flex", "flex"]}
            _hover={{
              bg: "gray.100",
            }}
            _focus={{
              border: "none",
            }}
            marginRight={4}
            rounded="full"
            bg="none"
          >
            <Text>{"<"}</Text>
          </PaginationPrevious>
          <PaginationPageGroup
            isInline
            align="center"
            separator={
              <PaginationSeparator
                bg="none"
                fontSize="sm"
                color={"gray.400"}
                maxWidth="30px"
                jumpSize={10}
              />
            }
          >
            {pages.map((page: number) => (
              <PaginationPage
                w={10}
                rounded="full"
                bg="gray.100"
                key={`pagination_page_${page}`}
                page={page}
                fontSize="xs"
                _hover={{
                  bg: "gray.300",
                }}
                _current={{
                  border: "2px",
                  borderColor: "purple.400",
                }}
                _focus={{
                  border: "2px",
                  borderColor: "purple.400",
                }}
              />
            ))}
          </PaginationPageGroup>
          <PaginationNext
            display={["none", "none", "flex", "flex"]}
            _hover={{
              bg: "gray.100",
            }}
            _focus={{
              border: "none",
            }}
            marginLeft={4}
            rounded="full"
            bg="none"
          >
            <Text>{">"}</Text>
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </>
  );
};

export default GroupPagination;
