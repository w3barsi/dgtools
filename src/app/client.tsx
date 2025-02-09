"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function Lists() {
  const [images, setImages] = useState<
    { src: string; contentType: string; name: string }[]
  >([]);
  const [cards] = api.trello.getPendingCards.useSuspenseQuery();
  const { mutateAsync: getAttachmentsMutation, data } =
    api.trello.getCardAttachments.useMutation({});

  const { mutateAsync: downloadAttachmentsMutation } =
    api.trello.downloadCardAttachments.useMutation({
      onSuccess: (data) => {
        console.log(data);
      },
    });

  const getAttachments = async (cardId: string) => {
    const data = await getAttachmentsMutation({ id: cardId });
    console.log(data);
    const i = data.map((d) => ({ url: d.url, name: d.name }));
    const results = await downloadAttachmentsMutation(i);
    setImages(
      results.map((result) => ({
        src: `data:${result.contentType};base64,${result.base64Image}`,
        contentType: result.contentType,
        name: result.name,
      })),
    );
    alert("Images are ready to download!");
  };

  const downloadAll = async () => {
    for (const image of images) {
      const link = document.createElement("a");
      link.href = image.src;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    alert("All images have been downloaded!");
  };

  return (
    <div className="flex flex-col">
      <Button onClick={async () => await downloadAll()}>Download All</Button>
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
    </div>
  );
}
