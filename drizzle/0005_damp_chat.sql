CREATE TABLE "support_sessions" (
	"telegram_user_id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"step" text NOT NULL,
	"name" text,
	"phone" text,
	"question" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
