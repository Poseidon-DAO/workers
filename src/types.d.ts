interface Artist {
  name: string;
  email: string;
  bio: string;
  twitter_url: string;
  instagram_url?: string;
  website?: string;
}

interface APIResponse {
  data: string;
}

interface APIError {
  error: {
    code: number;
    message: string;
  };
}
