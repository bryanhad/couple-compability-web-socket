export const FORM_QUESTIONS = {
    favColor: {
        fieldName: "favColor",
        label: `What's your favorite color?`,
        options: [
            { label: "Blue", value: "blue" },
            { label: "Red", value: "red" },
            { label: "Green", value: "green" },
            { label: "All Good", value: "allgood" },
        ],
    },
    favFood: {
        fieldName: "favFood",
        label: `What's your favorite food?`,
        options: [
            { label: "Siomay", value: "siomay" },
            { label: "Nasi Goreng", value: "nasgor" },
            { label: "Mie", value: "mie" },
            { label: "All Good", value: "allgood" },
        ],
    },
    favBoardGame: {
        fieldName: "favBoardGame",
        label: `What's your favorite board game?`,
        options: [
            { label: "Monopoly", value: "monopoly" },
            { label: "Capsa", value: "capsa" },
            { label: "Ular Tangga", value: "ulertangga" },
            { label: "Judi", value: "judi" },
        ],
    },
} as const

// type CompabilityFieldName = keyof typeof FORM_QUESTIONS

// export type CompabilityFormData = {
//     fieldName: CompabilityFieldName
//     answer: string
// }[]
