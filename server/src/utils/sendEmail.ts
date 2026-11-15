// sendEmail.ts
// Sends emails through Brevo.
// If Brevo is unavailable or configuration is missing,
// the email is printed in the server terminal as a fallback.

import { env } from "../config/env";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

// Fallback: print email in the terminal
const printEmail = (to: string, subject: string, text: string, why: string) => {
  console.log(
    [
      "",
      `================ EMAIL (not sent: ${why}) ================`,
      `To:      ${to}`,
      `Subject: ${subject}`,
      "",
      text,
      "=========================================================",
      "",
    ].join("\n"),
  );
};

// Convert plain text to simple HTML
const textToHtml = (text: string) => {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const linked = escaped.replace(/(https?:\/\/\S+)/g, '<a href="$1">$1</a>');

  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">${linked.replace(/\n/g, "<br>")}</div>`;
};

// Main email function
export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!env.brevoApiKey || !env.emailFrom) {
    printEmail(
      to,
      subject,
      text,
      "BREVO_API_KEY or EMAIL_FROM missing in .env",
    );
    return;
  }

  try {
    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": env.brevoApiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: env.emailFromName,
          email: env.emailFrom,
        },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: textToHtml(text),
      }),
    });

    if (!response.ok) {
      console.error(
        `Brevo refused the email (${response.status}):`,
        await response.text(),
      );

      printEmail(to, subject, text, `Brevo error ${response.status}`);
      return;
    }

    console.log(`Email sent with Brevo to ${to}: "${subject}"`);
  } catch (error) {
    console.error("Could not reach Brevo:", (error as Error).message);

    printEmail(to, subject, text, "could not reach Brevo");
  }
};
