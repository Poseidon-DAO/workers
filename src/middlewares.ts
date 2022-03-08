const withAuth = (req: Request): (Response | undefined) => {
  const token = req.headers.get('Authorization');
  if (token !== AUTH_SECRET) return new Response("Unauthorized", { status: 401 });
}

export { withAuth };