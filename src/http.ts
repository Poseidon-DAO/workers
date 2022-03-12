const corsHeaders = (): Headers => {
  const headers = new Headers()
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  headers.set("Content-Type", "application/json")
  return headers;
}

export { corsHeaders }