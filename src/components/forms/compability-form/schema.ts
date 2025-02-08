import { z } from "zod"
import { favBoardGames, favColors, favFoods } from "./form-data"

const getValues = <T extends readonly { value: string }[]>(arr: T) =>
    arr.map((item) => item.value)

export const compabilityFormSchema = z.object({
    favColor: z.string().refine((val) => getValues(favColors).includes(val), {
        message: "You need to select a valid color!",
    }),
    favFood: z.string().refine((val) => getValues(favFoods).includes(val), {
        message: "You need to select a valid food!",
    }),
    favBoardGame: z
        .string()
        .refine((val) => getValues(favBoardGames).includes(val), {
            message: "You need to select a valid board game!",
        }),
})

export type CompabilityFormFields = z.infer<typeof compabilityFormSchema>
