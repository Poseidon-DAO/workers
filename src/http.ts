const NewAPIError = (message: string, code: number, headers?: Headers): Response => {
  const resp: APIError = {
    error: {
      message,
      code
    }
  }
  return new Response(JSON.stringify(resp), { status: code, headers });
}

const NewAPIResponse = (data: any, code?: number, headers?: Headers): Response => {
  const resp: APIResponse = {
    data,
  }
  return new Response(JSON.stringify(resp), {
    status: code ?? 200, headers: headers ?? {
      "Content-Type": "application/json"
    }
  });
}

export { NewAPIResponse, NewAPIError };
