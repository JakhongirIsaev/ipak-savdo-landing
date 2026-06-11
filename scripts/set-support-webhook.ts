import "dotenv/config";

async function main() {
  const token = process.env.TELEGRAM_SUPPORT_BOT_TOKEN;
  const secret = process.env.TELEGRAM_SUPPORT_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!token || !secret || !siteUrl) {
    throw new Error(
      "TELEGRAM_SUPPORT_BOT_TOKEN, TELEGRAM_SUPPORT_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL all required",
    );
  }

  const webhookUrl = `${siteUrl.replace(/\/$/, "")}/api/telegram/support-webhook`;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["message"],
    }),
  });
  const json = await res.json();
  console.log("setWebhook response:", JSON.stringify(json, null, 2));

  const info = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const infoJson = await info.json();
  console.log("getWebhookInfo:", JSON.stringify(infoJson, null, 2));
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
