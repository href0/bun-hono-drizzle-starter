ALTER TABLE "roles" ALTER COLUMN "name" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "sub_menus" ADD COLUMN "is_active" boolean DEFAULT false;