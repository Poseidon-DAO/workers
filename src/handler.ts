import { Router } from 'itty-router';

const router = Router();

router.get("/status", () => {
  return new Response("Ok")
});

router.get("/artists", async () => {
  const values = await ARTISTS.list();

  const artists: Artist[] = [];
  for (const key of values.keys) {
    const value = await ARTISTS.get(`artist:${key}`, { type: "json" });
    artists.push(value as Artist);
  }

  return new Response(JSON.stringify(artists));
});

router.get("/artists/:email", async ({ params }) => {
  const value = await ARTISTS.get(`artist:${params?.email ?? ""}`, { type: "json" });
  if (value === null) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(value), {
    headers: {
      "Content-Type": "application/json"
    }
  });
});

router.post("/artists", async (req: Request) => {
  const body: Artist = await req.json();
  await ARTISTS.put(`artist:${body?.email ?? ""}`, JSON.stringify(body));
  return new Response("Ok");
});

router.all("*", () => new Response("Not Found", { status: 404 }));

export default router;