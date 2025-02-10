export const FORM_QUESTIONS = {
    favDateActivity: {
        fieldName: "favDateActivity",
        emoji: "🧑‍🤝‍🧑",
        label: `What's your idea of a "perfect" date?`,
        options: [
            {
                label: "Fine dining, candlelight, looking hot af",
                value: "fancy_dinner",
            },
            {
                label: "Netflix & chill… but actually watching",
                value: "netflix_chill",
            },
            {
                label: "Board games & aggressive rule enforcement",
                value: "board_game_night",
            },
            {
                label: "Running away from our responsibilities",
                value: "escape",
            },
        ],
    },
    bathroomEtiquette: {
        fieldName: "bathroomEtiquette",
        emoji: "🚽",
        label: `If you see the toilet paper roll is empty what do you do?`,
        options: [
            { label: "Replace it like a decent human being", value: "replace" },
            { label: "Pretend I didn't see it", value: "ignore" },
            {
                label: "Take the cardboard roll and make a kazoo",
                value: "kazoo",
            },
            { label: "Cry and hope someone else fixes it", value: "cry" },
        ],
    },
    apocalypticSkills: {
        fieldName: "apocalypticSkills",
        emoji: "🧟",
        label: `A zombie apocalypse just started. What's your biggest contribution to survival?`,
        options: [
            {
                label: "Fighting skills - I am the main character",
                value: "fighter",
            },
            { label: "Hiding - I am NOT a main character", value: "hider" },
            { label: "Cooking - We still gotta eat, right?", value: "cook" },
            {
                label: "Sacrificing myself immediately, no questions",
                value: "sacrifice",
            },
        ],
    },
    pizzaTopping: {
        fieldName: "pizzaTopping",
        emoji: "🍕",
        label: `Pineapple on pizza? Choose wisely, this is a deal-breaker.`,
        options: [
            { label: "YES, and I will defend it with my life", value: "yes" },
            { label: "No, and I will judge you forever", value: "no" },
            { label: "I don't care. Just give me food", value: "idc" },
            { label: "Pineapple? I eat pizza with bananas", value: "chaotic" },
        ],
    },
    loveLanguage: {
        fieldName: "loveLanguage",
        emoji: "😘",
        label: `What's your love language? (Aka: How do you demand affection?)`,
        options: [
            {
                label: "Words of affirmation (Tell me I'm pretty)",
                value: "words",
            },
            { label: "Acts of service (Do my laundry, pls)", value: "service" },
            { label: "Gifts (I accept cash, too)", value: "gifts" },
            {
                label: "Physical touch (Hugs or fights, either works)",
                value: "touch",
            },
        ],
    },
    conspiracyBelief: {
        fieldName: "conspiracyBelief",
        emoji: "👽",
        label: `Which conspiracy theory are you most likely to believe?`,
        options: [
            {
                label: "Birds aren't real. They're government drones.",
                value: "birds",
            },
            { label: "The moon landing was staged.", value: "moon" },
            { label: "Bigfoot exists and he owes me money.", value: "bigfoot" },
            { label: "None, I'm normal. (Lies.)", value: "normal" },
        ],
    },
    textingStyle: {
        fieldName: "textingStyle",
        emoji: "📱",
        label: `How do you text in a relationship?`,
        options: [
            { label: "Paragraphs. I am a poet.", value: "paragraphs" },
            { label: "One-word responses. Efficient.", value: "oneword" },
            { label: "Memes. Only memes.", value: "memes" },
            {
                label: "I forget to reply for 3-5 business days.",
                value: "ghost",
            },
        ],
    },
    spicyTolerance: {
        fieldName: "spicyTolerance",
        emoji: "🥵",
        label: `How spicy can you handle your food?`,
        options: [
            { label: "Mild - I cry over black pepper", value: "mild" },
            { label: "Medium - Just a little burn", value: "medium" },
            { label: "Spicy - Pain is temporary, flavor is forever", value: "spicy" },
            { label: "Ghost pepper challenge? Bring it on.", value: "extreme" },
        ],
    },
    howDoYouArgue: {
        fieldName: "howDoYouArgue",
        emoji: "🗣️",
        label: `If we argue, how does it end?`,
        options: [
            { label: "We talk it out like adults", value: "talk" },
            { label: "I send passive-aggressive memes", value: "memes" },
            { label: "I stare at you until you apologize", value: "stare" },
            { label: "I fake my own disappearance", value: "disappear" },
        ],
    },
    dreamPet: {
        fieldName: "dreamPet",
        emoji: "🐶",
        label: `What's your dream pet?`,
        options: [
            { label: "Dog - Loyal, cute, best friend", value: "dog" },
            { label: "Cat - Independent but chaotic", value: "cat" },
            { label: "Snake - I enjoy a little danger", value: "snake" },
            { label: "A pet rock. Low maintenance.", value: "rock" },
        ],
    },
} as const
