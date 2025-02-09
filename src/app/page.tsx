import { api, HydrateClient } from "~/trpc/server";
import Lists from "./client";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default async function Home() {
  await api.trello.getBoard.prefetch();
  return (
    <HydrateClient>
      <Suspense>
        <Lists />
      </Suspense>
    </HydrateClient>
  );
}
