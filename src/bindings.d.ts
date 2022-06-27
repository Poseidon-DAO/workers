export { };

declare global {
  const AUTH_SECRET: string;
  const POSTMARK_TOKEN: string;
  const POSTMARK_SENDER: string;
  const POSTMARK_RECEIVER: string;
  const POSTMARK_SUBJECT: string;
  const SLACK_WEBHOOK: string;
  const ARTISTS: KVNamespace;
}