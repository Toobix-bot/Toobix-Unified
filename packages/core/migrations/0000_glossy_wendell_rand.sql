CREATE TABLE `audits` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`payload` text,
	`result` text,
	`soul_mood` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chunk_tags` (
	`chunk_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`chunk_id`) REFERENCES `chunks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`doc_source` text NOT NULL,
	`doc_title` text,
	`text` text NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `circle_members` (
	`id` text PRIMARY KEY NOT NULL,
	`circle_id` text NOT NULL,
	`person_id` text NOT NULL,
	`role` text,
	`joined_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `circles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`description` text,
	`color` text,
	`icon` text,
	`shared_spaces` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `interactions` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text NOT NULL,
	`kind` text NOT NULL,
	`summary` text NOT NULL,
	`sentiment` text NOT NULL,
	`details` text,
	`love_points` integer DEFAULT 0,
	`gratitude` text,
	`story_arc_id` text,
	`story_event_id` text,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `moment_people` (
	`id` text PRIMARY KEY NOT NULL,
	`moment_id` text NOT NULL,
	`person_id` text NOT NULL,
	`role` text,
	FOREIGN KEY (`moment_id`) REFERENCES `moments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `moments` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`location` text,
	`date` integer NOT NULL,
	`photos` text,
	`tags` text,
	`story_arc_id` text,
	`story_event_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`relation` text NOT NULL,
	`avatar` text,
	`notes` text DEFAULT '',
	`tags` text,
	`metadata` text,
	`circles` text,
	`consciousness_level` real,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `soul_state` (
	`id` text PRIMARY KEY NOT NULL,
	`mood` text NOT NULL,
	`energy_level` real NOT NULL,
	`focus_state` text NOT NULL,
	`values` text,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `story_arcs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`completed_at` integer
);
--> statement-breakpoint
CREATE TABLE `story_events` (
	`id` text PRIMARY KEY NOT NULL,
	`arc_id` text,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`kind` text NOT NULL,
	`status` text NOT NULL,
	`xp_reward` integer DEFAULT 0,
	`love_points_reward` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`arc_id`) REFERENCES `story_arcs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audits_action_idx` ON `audits` (`action`);--> statement-breakpoint
CREATE INDEX `audits_created_idx` ON `audits` (`created_at`);--> statement-breakpoint
CREATE INDEX `chunk_tags_chunk_idx` ON `chunk_tags` (`chunk_id`);--> statement-breakpoint
CREATE INDEX `chunk_tags_tag_idx` ON `chunk_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `chunks_source_idx` ON `chunks` (`doc_source`);--> statement-breakpoint
CREATE INDEX `chunks_created_idx` ON `chunks` (`created_at`);--> statement-breakpoint
CREATE INDEX `circle_members_circle_idx` ON `circle_members` (`circle_id`);--> statement-breakpoint
CREATE INDEX `circle_members_person_idx` ON `circle_members` (`person_id`);--> statement-breakpoint
CREATE INDEX `circles_name_idx` ON `circles` (`name`);--> statement-breakpoint
CREATE INDEX `circles_type_idx` ON `circles` (`type`);--> statement-breakpoint
CREATE INDEX `interactions_person_idx` ON `interactions` (`person_id`);--> statement-breakpoint
CREATE INDEX `interactions_kind_idx` ON `interactions` (`kind`);--> statement-breakpoint
CREATE INDEX `interactions_timestamp_idx` ON `interactions` (`timestamp`);--> statement-breakpoint
CREATE INDEX `moment_people_moment_idx` ON `moment_people` (`moment_id`);--> statement-breakpoint
CREATE INDEX `moment_people_person_idx` ON `moment_people` (`person_id`);--> statement-breakpoint
CREATE INDEX `moments_date_idx` ON `moments` (`date`);--> statement-breakpoint
CREATE INDEX `moments_title_idx` ON `moments` (`title`);--> statement-breakpoint
CREATE INDEX `people_name_idx` ON `people` (`name`);--> statement-breakpoint
CREATE INDEX `people_relation_idx` ON `people` (`relation`);--> statement-breakpoint
CREATE INDEX `people_created_idx` ON `people` (`created_at`);--> statement-breakpoint
CREATE INDEX `story_arcs_status_idx` ON `story_arcs` (`status`);--> statement-breakpoint
CREATE INDEX `story_events_arc_idx` ON `story_events` (`arc_id`);--> statement-breakpoint
CREATE INDEX `story_events_status_idx` ON `story_events` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);