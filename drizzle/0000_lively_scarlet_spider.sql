CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_name" text NOT NULL,
	"business_type" text NOT NULL,
	"business_type_other" text,
	"owner_name" text NOT NULL,
	"owner_contact" text NOT NULL,
	"needs_equipment" boolean DEFAULT false NOT NULL,
	"comment" text,
	"source" text DEFAULT 'direct' NOT NULL,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"referrer" text,
	"user_agent" text,
	"ip" text,
	"language" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_source_idx" ON "leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");