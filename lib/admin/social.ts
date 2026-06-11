// Telegram channel stats. Bot API only exposes the subscriber count for a
// channel (views/growth are not available via API). The lead bot is an admin
// of @bir_liy, so getChatMemberCount works with TELEGRAM_BOT_TOKEN.

export const TELEGRAM_CHANNEL = "@bir_liy";

export async function getTelegramSubscribers(): Promise<number | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/getChatMemberCount?chat_id=${encodeURIComponent(TELEGRAM_CHANNEL)}`,
      { cache: "no-store" },
    );
    const data = (await res.json()) as { ok: boolean; result?: number };
    return data.ok && typeof data.result === "number" ? data.result : null;
  } catch {
    return null;
  }
}
