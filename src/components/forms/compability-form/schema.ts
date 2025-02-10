import { z } from "zod"
// import { FORM_QUESTIONS } from "./form-data"

// const getValues = <T extends readonly { value: string }[]>(arr: T) =>
//     arr.map((item) => item.value)

export const compabilityFormSchema = z.object({
    favDateActivity: z.string({
        required_error: "Please select one of the options",
    }),
    // .refine(
    //     (val) => getValues(FORM_QUESTIONS.favColor.options).includes(val),
    //     {
    //         message: "You need to select a valid color!",
    //     },
    // ),
    bathroomEtiquette: z.string({
        required_error: "Please select one of the options",
    }),
    apocalypticSkills: z.string({
        required_error: "Please select one of the options",
    }),
    pizzaTopping: z.string({
        required_error: "Please select one of the options",
    }),
    loveLanguage: z.string({
        required_error: "Please select one of the options",
    }),
    conspiracyBelief: z.string({
        required_error: "Please select one of the options",
    }),
    textingStyle: z.string({
        required_error: "Please select one of the options",
    }),
    spicyTolerance: z.string({
        required_error: "Please select one of the options",
    }),
    howDoYouArgue: z.string({
        required_error: "Please select one of the options",
    }),
    dreamPet: z.string({
        required_error: "Please select one of the options",
    }),
})

export type CompabilityFormFields = z.infer<typeof compabilityFormSchema>
