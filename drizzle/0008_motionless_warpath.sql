CREATE TABLE "site_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event" text NOT NULL,
	"path" text NOT NULL,
	"visitor_id" text NOT NULL,
	"session_id" text NOT NULL,
	"locale" text,
	"device" text,
	"placement" text,
	"reason" text,
	"source" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "site_events_created_at_idx" ON "site_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "site_events_event_idx" ON "site_events" USING btree ("event");--> statement-breakpoint
CREATE INDEX "site_events_session_idx" ON "site_events" USING btree ("session_id");