export type ShopItem = {
    id: number;
    name: string;
    description: string;
    emoji: string;
    price: number;
};

export const hunterShopItems = [
    {
        id: 1,
        name: "Freeze!",
        description: "Alle Runners moeten 30 sec bevriezen.",
        emoji: "❄️",
        price: 50,
    },
    {
        id: 2,
        name: "Extra tijd",
        description: "Voegt 5 minuten toe aan de game timer",
        emoji: "🕒",
        price: 30,
    },
    {
        id: 3,
        name: "Hint",
        description: "Alle runners zijn zichtbaar op de map.",
        emoji: "🗺️",
        price: 60,
    },
];

export const runnerShopItems = [
    {
        id: 1,
        name: "Ghostwalk",
        description: "Stappen worden tijdelijk niet geüpdatet voor Hunter radar.",
        emoji: "🚶‍♂️",
        price: 50,
    },
    {
        id: 2,
        name: "Freeze!",
        description: "De Hunter moet 30 seconden stilstaan.",
        emoji: "❄️",
        price: 50,
    },
    {
        id: 3,
        name: "Decoy",
        description: "Hunter krijgt een valse locatie als hint.",
        emoji: "🕵️",
        price: 60,
    },
];
