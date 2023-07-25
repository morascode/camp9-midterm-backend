import { z } from 'zod';
export const bookmarkParamsValidation = z.number().int();
export type BookmarkParams = z.infer<typeof bookmarkParamsValidation>;

export const bookmarkToggleValidation = z.object({
  createBookmark: z.boolean(),
});
export type BookmarkToggle = z.infer<typeof bookmarkToggleValidation>;
