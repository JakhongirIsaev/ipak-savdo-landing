CREATE TABLE "bot_sessions" (
	"telegram_user_id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"step" text NOT NULL,
	"name" text,
	"phone" text,
	"business_type" text,
	"city" text,
	"patent_file_id" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "patent_file_id" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "shop_photo_file_id" text;