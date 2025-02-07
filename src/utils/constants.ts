export const wsEvents = ["join-room", "submit-form"] as const

export type WSEvents = (typeof wsEvents)[number]

export const ROOM_ROLE_KEY = 'room_role'