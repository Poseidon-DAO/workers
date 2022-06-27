import postmark from "postmark";

const sendEmail = async (from: string, to: string, subject: string, body: string): Promise<void> => {
  const client = new postmark.ServerClient(POSTMARK_TOKEN);
  
  await client.sendEmail({
    "From": from,
    "To": to,
    "Subject": subject,
    "TextBody": body
  });
};

const formatArtistApplication = (artist: Artist): string => {
  return `<html>
  <body>
    <h1>New ${artist.project ? artist.project.charAt(0).toUpperCase() + artist.project.slice(1) + " " : ""}Artist Application</h1></br>
    <h3>${artist.name} - ${artist.email}</h3></br>
    <h2>Bio</h2>
    <p>${artist.bio}</p>
    <p>${artist.exhibitions}</p></br></br>
    <h2>Info</h2>
    <a>${artist.samples}</a>
    <a>${artist.twitter_url}</a>
    <a>${artist.instagram_url ? "<a>" + artist.instagram_url + "</a>" : ""}</a>
    <a>${artist.website ? "<a>" + artist.website + "</a>" : ""}</a>
  </body>
</html>`
}

export { sendEmail, formatArtistApplication };