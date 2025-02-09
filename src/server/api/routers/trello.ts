import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const key = `key=${env.TRELLO_KEY}&token=${env.TRELLO_TOKEN}`;

type ListType = {
  id: string;
  name: string;
};

const cardSchema = z.array(z.object({ id: z.string(), name: z.string() }));
const cardAttachmentSchema = z.array(
  z.object({
    url: z.string(),
    name: z.string(),
    mimeType: z.string(),
  }),
);

export const trelloRouter = createTRPCRouter({
  getCardAttachments: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await fetch(
        `https://api.trello.com/1/cards/${input.id}/attachments?${key}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );
      return cardAttachmentSchema.parse(await res.json());
    }),
  getPendingCards: publicProcedure.query(async () => {
    const res = await fetch(
      `https://api.trello.com/1/lists/640a949b4ba1939f720607a0/cards?${key}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const unparsedCards = await res.json();
    const parsed = cardSchema.parse(unparsedCards);
    return parsed;
  }),
  getBoard: publicProcedure.query(async () => {
    const res = await fetch(
      `https://api.trello.com/1/boards/1ELaQNZb/lists?${key}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const unparsedList = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const lists = unparsedList.map((list: ListType) => ({
      id: list.id,
      name: list.name,
    }));

    return lists as ListType[];
  }),
});
