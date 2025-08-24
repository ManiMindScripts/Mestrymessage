import { z } from "zod"

export const messageSchema = z.object({
    content: z.
    string()
    .min(10, "Message must be in 10 character")
    .max(300, "Message content is not more than 300 character")
    
})