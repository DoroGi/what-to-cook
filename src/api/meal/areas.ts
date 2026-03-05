import { z } from "zod/mini";
import { BASE_URL } from ".";

export type Area = z.infer<typeof AreaSchema>;

const AreaSchema = z.string();
const AreaListResponseSchema = z.object({
  meals: z.nullable(z.array(z.object({ strArea: AreaSchema }))),
});

export const fetchAreas = async (): Promise<Area[]> => {
  const response = await fetch(`${BASE_URL}/list.php?a=list`);
  if (!response.ok) throw new Error("Failed to fetch areas");
  const data = AreaListResponseSchema.parse(await response.json());
  return data.meals?.map((m) => m.strArea) ?? [];
};
