import { z } from "zod";

export const HevyUserInfo = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
});

export const HevyUserInfoResponse = z.object({
  data: HevyUserInfo,
});
