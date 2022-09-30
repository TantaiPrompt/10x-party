import React from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";
import {
  Text,
  Heading,
  Button,
  Stack,
  Divider,
  AvatarGroup,
  Avatar,
} from "@chakra-ui/react";
import { Group, User } from "@prisma/client";

export type GroupInfo = {
  id: number;
  groupId: string;
  group: {
    id: number;
    name: string;
    masterId: string;
    membersLimit: number;
    master: User;
  };
  members: User[];
  _count: {
    members: number;
  };
};

const Group: React.FC<{
  groupInfo: GroupInfo;
  currentPage: number;
  userId: string;
}> = ({ groupInfo, currentPage, userId }) => {
  const { data: session } = useSession();
  const masterGroup = groupInfo.group.master.name
    ? groupInfo.group.master.name
    : "Unknown author";

  const handleJoinGroup = async () => {
    const res = await fetch(`/api/groups/join/${groupInfo.groupId}`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (res.status === 200) {
      Router.push(`/?page=${currentPage}`);
    }
  };
  const handleLeaveGroup = async () => {
    const res = await fetch(
      `/api/groups/leave/${groupInfo.groupId}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
    if (res.status === 200) {
      Router.push(`/?page=${currentPage}`);
    }
  };

  const DynButton = () => {
    let displayText = "Join";
    let isDisabled = false;
    if (session) {
      if (groupInfo.members.some((member) => member.id === userId)) {
        displayText = "Leave";
        isDisabled = false;
      } else if (
        groupInfo._count.members <= groupInfo.group.membersLimit
      ) {
        displayText = "Join";
        isDisabled = false;
      } else {
        displayText = "Full";
        isDisabled = true;
      }
    }
    return (
      <Button
        onClick={
          displayText === "Join" ? handleJoinGroup : handleLeaveGroup
        }
        width={["90%", "90%", "70%", "70%"]}
        _focus={{
          border: "none",
        }}
        disabled={isDisabled}
      >
        {displayText}
      </Button>
    );
  };

  return (
    <>
      <Stack
        direction={"column"}
        spacing="20px"
        height="100%"
        justifyContent="space-between"
      >
        <AvatarGroup max={2}>
          {groupInfo.members.map((member) => (
            <Avatar key={member.id} name={member.name} />
          ))}
        </AvatarGroup>
        <Stack spacing={2} marginBottom={5}>
          <Heading size="md">
            {groupInfo.group.name.length > 25
              ? `${groupInfo.group.name.slice(0, 25)}....`
              : groupInfo.group.name}
          </Heading>
          <Text fontSize="sm">
            created by <i>{masterGroup}</i>
          </Text>
          {/* <ReactMarkdown source={post.content} /> */}
        </Stack>

        <Stack spacing={5}>
          <Divider />
          <Stack
            alignItems="center"
            justifyContent="space-between"
            direction={["column", "column", "row", "row"]}
          >
            <Text
              fontWeight="extrabold"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="xl"
            >
              {groupInfo._count.members}/
              {groupInfo.group.membersLimit}
            </Text>
            {session ? <DynButton /> : null}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Group;
