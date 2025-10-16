CREATE TABLE `companion_relationships` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`companion_id` text NOT NULL,
	`companion_name` text NOT NULL,
	`level` integer DEFAULT 1,
	`points` integer DEFAULT 0,
	`tier` text DEFAULT 'new',
	`mood` text DEFAULT 'neutral',
	`is_unlocked` integer DEFAULT false,
	`dialogues_unlocked` integer DEFAULT 0,
	`special_ability` text,
	`last_interaction` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `player_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_events` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`session_id` text,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`related_quest_id` text,
	`related_companion_id` text,
	`xp_change` integer DEFAULT 0,
	`stat_changes` text,
	`rewards` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `player_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `game_quests` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`session_id` text,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`status` text NOT NULL,
	`progress` integer DEFAULT 0,
	`xp_reward` integer DEFAULT 0,
	`item_rewards` text,
	`requirements` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`player_id`) REFERENCES `player_profile`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`session_id`) REFERENCES `game_sessions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `game_rewards` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`rarity` text NOT NULL,
	`effects` text,
	`icon` text,
	`quantity` integer DEFAULT 1,
	`is_equipped` integer DEFAULT false,
	`is_permanent` integer DEFAULT false,
	`gained_at` integer DEFAULT (unixepoch()) NOT NULL,
	`gained_from` text,
	FOREIGN KEY (`player_id`) REFERENCES `player_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`run_number` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text NOT NULL,
	`mode` text NOT NULL,
	`day` integer DEFAULT 1,
	`total_days` integer DEFAULT 7,
	`xp_gained` integer DEFAULT 0,
	`items_gained` integer DEFAULT 0,
	`quests_completed` integer DEFAULT 0,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`completed_at` integer,
	`permanent_rewards` text,
	FOREIGN KEY (`player_id`) REFERENCES `player_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `player_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`xp_to_next_level` integer DEFAULT 100 NOT NULL,
	`creativity` integer DEFAULT 50 NOT NULL,
	`wisdom` integer DEFAULT 50 NOT NULL,
	`love` integer DEFAULT 50 NOT NULL,
	`energy` integer DEFAULT 50 NOT NULL,
	`focus` integer DEFAULT 50 NOT NULL,
	`class` text DEFAULT 'Seeker',
	`current_run_id` text,
	`total_runs` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`skill_id` text NOT NULL,
	`skill_name` text NOT NULL,
	`category` text NOT NULL,
	`level` integer DEFAULT 1,
	`xp` integer DEFAULT 0,
	`xp_to_next_level` integer DEFAULT 100,
	`times_used` integer DEFAULT 0,
	`mastery` text DEFAULT 'beginner',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`player_id`) REFERENCES `player_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `companion_relationships_player_idx` ON `companion_relationships` (`player_id`);--> statement-breakpoint
CREATE INDEX `companion_relationships_companion_idx` ON `companion_relationships` (`companion_id`);--> statement-breakpoint
CREATE INDEX `game_events_player_idx` ON `game_events` (`player_id`);--> statement-breakpoint
CREATE INDEX `game_events_session_idx` ON `game_events` (`session_id`);--> statement-breakpoint
CREATE INDEX `game_events_type_idx` ON `game_events` (`type`);--> statement-breakpoint
CREATE INDEX `game_events_created_idx` ON `game_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `game_quests_player_idx` ON `game_quests` (`player_id`);--> statement-breakpoint
CREATE INDEX `game_quests_session_idx` ON `game_quests` (`session_id`);--> statement-breakpoint
CREATE INDEX `game_quests_status_idx` ON `game_quests` (`status`);--> statement-breakpoint
CREATE INDEX `game_quests_category_idx` ON `game_quests` (`category`);--> statement-breakpoint
CREATE INDEX `game_rewards_player_idx` ON `game_rewards` (`player_id`);--> statement-breakpoint
CREATE INDEX `game_rewards_type_idx` ON `game_rewards` (`type`);--> statement-breakpoint
CREATE INDEX `game_rewards_rarity_idx` ON `game_rewards` (`rarity`);--> statement-breakpoint
CREATE INDEX `game_sessions_player_idx` ON `game_sessions` (`player_id`);--> statement-breakpoint
CREATE INDEX `game_sessions_status_idx` ON `game_sessions` (`status`);--> statement-breakpoint
CREATE INDEX `player_skills_player_idx` ON `player_skills` (`player_id`);--> statement-breakpoint
CREATE INDEX `player_skills_skill_idx` ON `player_skills` (`skill_id`);--> statement-breakpoint
CREATE INDEX `player_skills_category_idx` ON `player_skills` (`category`);