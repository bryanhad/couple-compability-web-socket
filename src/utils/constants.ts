const wsEvents = ["join-room", "submit-form"] as const

type WSEvents = (typeof wsEvents)[number]