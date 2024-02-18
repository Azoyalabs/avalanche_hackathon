import { z } from 'zod';

export const publishSchema = z.object({
	title: z.string().min(5).max(50),
	description: z.string().min(10),
	image: z.any(),
	content: z.string().min(5),
	free: z.boolean().default(true),

});

export type PublishSchema = typeof publishSchema;
