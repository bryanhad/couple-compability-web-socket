import { z } from "zod"
import { FORM_QUESTIONS } from "./form-data"

const getValues = <T extends readonly { value: string }[]>(arr: T) =>
    arr.map((item) => item.value)

export const compabilityFormSchema = z.object({
    favColor: z
        .string({ required_error: "Please select one of the options" })
        .refine(
            (val) => getValues(FORM_QUESTIONS.favColor.options).includes(val),
            {
                message: "You need to select a valid color!",
            },
        ),
    favFood: z
        .string({ required_error: "Please select one of the options" })
        .refine(
            (val) => getValues(FORM_QUESTIONS.favFood.options).includes(val),
            {
                message: "You need to select a valid food!",
            },
        ),
    favBoardGame: z
        .string({ required_error: "Please select one of the options" })
        .refine(
            (val) =>
                getValues(FORM_QUESTIONS.favBoardGame.options).includes(val),
            {
                message: "You need to select a valid board game!",
            },
        ),
})

export type CompabilityFormFields = z.infer<typeof compabilityFormSchema>
