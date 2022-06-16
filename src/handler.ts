import { Router } from 'itty-router';
import { withAuth } from './middlewares';
import { NewAPIResponse, NewAPIError } from './http';
import { handleCors, corsHeaders } from "./cors";
import Joi = require("joi");

const router = Router();

router.options("*", handleCors({}));

router.get("/status", () => {
  return NewAPIResponse("Ok")
});

router.get("/artists", withAuth, async () => {
  const values = await ARTISTS.list();

  const artists: Artist[] = [];
  for (const key of values.keys) {
    const value = await ARTISTS.get(key.name, { type: "json" });
    if (value) artists.push(value as Artist);
  }
  return NewAPIResponse(artists);
});

const getArtistByEmail = async (email: string): Promise<Artist> => {
  const value: Artist | null = await ARTISTS.get(`artist:${email}`, { type: "json" });
  if (value == null) {
    const error: APIError = {
      error: {
        message: "Not Found",
        code: 404,
      }
    };
    throw error;
  }
  return value;
}

router.get("/artists/:email", withAuth, async ({ params }) => {
  try {
    const value = await getArtistByEmail(params?.email ?? "")
    return NewAPIResponse(value)
  } catch (error) {
    return NewAPIError((error as APIError).error.message, (error as APIError).error.code)
  }
});

const schema = Joi.object().keys({
  name: Joi.string().trim().max(70).required(),
  email: Joi.string().lowercase().trim().max(320).email({ tlds: { allow: false }, minDomainSegments: 2 }).required(),
  bio: Joi.string().trim().max(320).required(),
  twitter_url: Joi.string().uri().pattern(new RegExp('twitter.com')).required(),
  instagram_url: Joi.string().uri().pattern(new RegExp('instagram.com')).allow(null, ''),
  website: Joi.string().uri().allow(null, ''),
  project: Joi.string().valid("Derivatives", "Genesis", "Other").required(),
});

router.post("/artists", async (req: Request) => {
  const body: Artist = await req.json();

  try {
    await schema.validateAsync(body);
  } catch (error) {
    return NewAPIError(error as string, 400, corsHeaders())
  }

  try {
    const artist = await getArtistByEmail(body.email ?? "");
    if (artist) {
      return NewAPIError("You cannot apply twice", 409, corsHeaders())
    }
  } catch (_error) {
    undefined
  }

  await ARTISTS.put(`artist:${body?.email ?? ""}`, JSON.stringify(body));

  return NewAPIResponse("Ok", 200, corsHeaders())
});

router.all("*", () => NewAPIError("Not Found", 404));

export default router;