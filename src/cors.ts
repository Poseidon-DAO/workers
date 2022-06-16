interface Options {
  origin?: string;
  methods?: string;
  headers?: string;
  maxAge?: string | null;
  allowCredentials?: string;
}

const handleCors = (options: Options) => (request: Request) => {
  const {
    origin = '*',
    methods = 'GET, POST, PATCH, DELETE',
    headers = 'referer, origin, content-type',
    maxAge = '',
    allowCredentials = false,
  } = options;

  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null
  ) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': methods,
      'Access-Control-Allow-Headers': headers,
      'Access-Control-Allow-Credentials': 'false',
      'Access-Control-Max-Age': '',
    };

    if (allowCredentials) {
      corsHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    if (maxAge) {
      corsHeaders['Access-Control-Max-Age'] = maxAge;
    }

    // Handle CORS pre-flight request.
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Handle standard OPTIONS request.
  return new Response(null, {
    headers: {
      'Allow': `${methods}, HEAD, OPTIONS`,
    }
  });
}

const wrapCorsHeader = (response: Response, options: Options): Response => {
  const {
    origin = '*',
  } = options;

  response.headers.set('Access-Control-Allow-Origin', origin);
  return response;
}

const corsHeaders = (): Headers => {
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS")
  headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  headers.set("Content-Type", "application/json")
  return headers;
}

export { handleCors, wrapCorsHeader, corsHeaders }