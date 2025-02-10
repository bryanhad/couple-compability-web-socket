import { z } from "zod"

export function generateCompabilityFormSchema(questionKeys: string[]) {
    const schemaShape = questionKeys.reduce(
        (acc, key) => {
            acc[key] = z.string({
                required_error: "Please select one of the options",
            })
            return acc
        },
        {} as Record<string, z.ZodString>,
    )

    return z.object(schemaShape)
}

export type CompabilityFormFields = z.infer<ReturnType<typeof generateCompabilityFormSchema>>
