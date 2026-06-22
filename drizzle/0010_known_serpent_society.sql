CREATE TABLE "content_objects" (
	"id" text PRIMARY KEY NOT NULL,
	"campaign_id" text,
	"brief" text NOT NULL,
	"status" text DEFAULT 'pending_approval' NOT NULL,
	"platforms" jsonb DEFAULT '["blog","telegram"]'::jsonb NOT NULL,
	"drafts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"assets" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"approved_draft_version" integer,
	"approved_asset_version" integer,
	"publish_jobs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"dead_letters" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source" text DEFAULT 'api' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "content_objects_status_idx" ON "content_objects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_objects_created_at_idx" ON "content_objects" USING btree ("created_at");