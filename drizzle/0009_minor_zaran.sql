CREATE TABLE "keyword_ranks" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"locale" text NOT NULL,
	"engine" text DEFAULT 'google' NOT NULL,
	"location" text,
	"position" integer,
	"url_found" text,
	"competitors" text,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "keyword_ranks_keyword_locale_idx" ON "keyword_ranks" USING btree ("keyword","locale");--> statement-breakpoint
CREATE INDEX "keyword_ranks_checked_at_idx" ON "keyword_ranks" USING btree ("checked_at");