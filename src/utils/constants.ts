export const wsEvents = [
    "joiner-joined-room",
    "creator-has-been-waiting",
    "creator-submitted-form",
    "joiner-submitted-form",
] as const

export const formLanguage = [
    { short: "EN", long: "English" },
    { short: "ID", long: "Indonesian" },
] as const

export type FormLanguage = (typeof formLanguage)[number]["short"]

export type WSEvents = (typeof wsEvents)[number]
