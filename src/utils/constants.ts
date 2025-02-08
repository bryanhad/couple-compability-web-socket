export const wsEvents = [
    "joiner-joined-room",
    "creator-has-been-waiting",
    "creator-submitted-form",
    "joiner-submitted-form",
] as const

export type WSEvents = (typeof wsEvents)[number]

export const ROOM_ROLE_KEY = "room_role"
