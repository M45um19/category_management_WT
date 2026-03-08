import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100),

  parentId: z
    .string()
    .optional()
    .nullable(),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;