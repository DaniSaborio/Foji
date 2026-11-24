CREATE TABLE `github_cuentas` (
	`usuario_id` text PRIMARY KEY NOT NULL,
	`github_login` text NOT NULL,
	`github_user_id` integer NOT NULL,
	`avatar_url` text,
	`access_token_enc` text NOT NULL,
	`token_exp` text,
	`refresh_token_enc` text,
	`refresh_exp` text,
	`scope` text,
	`creado_en` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')) NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade
);
