ALTER TABLE "content_objects" ADD COLUMN "webhook_event_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "content_objects_webhook_event_key_idx" ON "content_objects" USING btree ("webhook_event_key");
