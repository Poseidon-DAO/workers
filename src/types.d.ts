interface Artist {
  name: string;
  email: string;
  bio: string;
  twitter_url: string;
  instagram_url?: string;
  website?: string;
}

interface APIError {
  message: string;
  code: number;
}