import { Router } from 'itty-router';
import { withAuth } from './middlewares';
import { corsHeaders } from './http';
import Joi = require("joi");

const router = Router();

router.options("*", () => new Response("", {
  status: 200, headers: corsHeaders()
}));

router.get("/status", () => {
  return new Response("Ok")
});

router.get("/artists", withAuth, async () => {
  const values = await ARTISTS.list();

  const artists: Artist[] = [];
  for (const key of values.keys) {
    const value = await ARTISTS.get(key.name, { type: "json" });
    if (value) artists.push(value as Artist);
  }

  return new Response(JSON.stringify(artists));
});

const getArtistByEmail = async (email: string): Promise<Artist> => {
  const value: Artist | null = await ARTISTS.get(`artist:${email}`, { type: "json" });
  if (value == null) {
    const error: APIError = {
      message: "Not Found",
      code: 404,
    };
    throw error;
  }
  return value;
}

router.get("/artists/:email", withAuth, async ({ params }) => {
  try {
    const value = await getArtistByEmail(params?.email ?? "")
    return new Response(JSON.stringify(value), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response((error as APIError).message, { status: (error as APIError).code });
  }
});

const schema = Joi.object().keys({
  name: Joi.string().trim().max(70).required(),
  email: Joi.string().lowercase().trim().max(320).email({ tlds: { allow: false }, minDomainSegments: 2 }).required(),
  bio: Joi.string().trim().max(320).required(),
  twitter_url: Joi.string().uri().pattern(new RegExp('twitter.com')).required(),
  instagram_url: Joi.string().uri().pattern(new RegExp('instagram.com')),
  website: Joi.string().uri(),
});

router.post("/artists", async (req: Request) => {
  const body: Artist = await req.json();

  try {
    await schema.validateAsync(body);
  } catch (error) {
    return new Response(error as string, { status: 400, headers: corsHeaders() });
  }

  try {
    const artist = await getArtistByEmail(body.email ?? "");
    if (artist) {
      return new Response("You cannot apply twice", { status: 409, headers: corsHeaders() });
    }
  } catch (_error) {
    undefined
  }

  await ARTISTS.put(`artist:${body?.email ?? ""}`, JSON.stringify(body));
  return new Response("Ok", { headers: corsHeaders() });
});

router.all("*", () => new Response("Not Found", { status: 404 }));

export default router;