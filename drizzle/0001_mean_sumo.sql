ALTER TABLE "permissions" RENAME COLUMN "api_endpoint" TO "url";--> statement-breakpoint
DROP INDEX "endpoint_method_idx";--> statement-breakpoint
ALTER TABLE "menus" ADD COLUMN "url" varchar(10) DEFAULT '#' NOT NULL;--> statement-breakpoint
ALTER TABLE "menus" ADD COLUMN "is_active" boolean DEFAULT false;--> statement-breakpoint
CREATE UNIQUE INDEX "endpoint_method_idx" ON "permissions" USING btree ("url","method");