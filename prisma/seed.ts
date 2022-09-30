import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    posts: {
      create: [
        {
          title: "Join the Prisma Slack",
          content: "https://slack.prisma.io",
          published: true,
        },
      ],
    },
  },
  {
    name: "Nilu",
    email: "nilu@prisma.io",
    posts: {
      create: [
        {
          title: "Follow Prisma on Twitter",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
];

const groupData: Prisma.GroupCreateInput[] = Array.from({
  length: 100,
}).map((_, i) => ({
  name: `Group ${i}`,
  master: { connect: { email: "alice@prisma.io" } },
  membersLimit: 3,
}));

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
  for (let i = 0; i < 100; i++) {
    const res = await prisma.group.create({
      data: groupData[i],
    });
    await prisma.groupMembers.create({
      data: {
        group: { connect: { id: res.id } },
        members: { connect: { email: "alice@prisma.io" } },
      },
    });

    console.log(`Created group with id: ${i}`);
  }
  console.log(`Seeding group finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
