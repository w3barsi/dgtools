"use client";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function Lists() {
  const [cards] = api.trello.getPendingCards.useSuspenseQuery();
  const { mutate, data } = api.trello.getCardAttachments.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const getAttachments = (id: string) => {
    mutate({ id });
  };

  return (
    <div className="flex flex-col">
      <main className="grid w-full grid-cols-1 gap-2 bg-red-200 p-2 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          return (
            <Card key={card.id} className="col-span-1">
              <CardHeader>{card.name}</CardHeader>
              <Button
                className="w-full"
                onClick={() => getAttachments(card.id)}
              >
                Download Attachments
              </Button>
            </Card>
          );
        })}
      </main>
      {data
        ? data.map((d) => {
            return (
              <div key={d.url} className="grid grid-cols-2">
                <Card>
                  <CardContent>
                    {d.mimeType === "image/jpeg" ? (
                      <img alt={d.name} src={d.url} />
                    ) : (
                      d.url
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })
        : null}
    </div>
  );
}
