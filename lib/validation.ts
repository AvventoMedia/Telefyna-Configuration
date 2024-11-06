import {z} from "zod";

export const TelefynaFormValidation = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    version: z.string().min(3, {
        message: "Version must be at least 3 characters.",
    }),
    email: z.string().email("Invalid email address."),
    wait: z.number().int().nonnegative({
        message: "Wait time should not be negative.",
    }),
    automationDisabled: z.boolean(),
    notificationsDisabled: z.boolean(),
})