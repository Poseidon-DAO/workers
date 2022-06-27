const slackApplicationError = async (name: Artist, error: string): Promise<void> => {
  await fetch(SLACK_WEBHOOK, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      channel: "#artist-application",
      username: "artist-application-webhook",
      text: "error: " + error + " | " + JSON.stringify(name),
      icon_emoji: ":name_badge:"
    }),
  })
}

const slackApplicationSuccess = async (artist: Artist): Promise<void> => {
  await fetch(SLACK_WEBHOOK, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      channel: "#artist-application",
      username: "artist-application-webhook",
      text: JSON.stringify(artist),
      icon_emoji: ":white_check_mark:"
    }),
  })
}

export { slackApplicationSuccess, slackApplicationError }