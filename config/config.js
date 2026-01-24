export const CONFIG = {
    CANVAS_WIDTH: window.innerWidth,
    CANVAS_HEIGHT: window.innerHeight,

    PLAYER: {
        START_WIDTH: 55,
        START_HEIGHT: 45,
        ACCELERATION: 0.1,
        GROWTH_WIDTH: 2,
        GROWTH_HEIGHT: 1.5,
        EAT_POINTS: 10 
    },

    DIRECTION: { RIGHT: 1, LEFT: -1 },

    SIZE: { TINY: 0, SMALL: 1, MEDIUM: 2, LARGE: 3 },

    THRESHOLD: { 
        SMALL: 100, 
        MEDIUM: 250, 
        LARGE: 450, 
        WIN: 650 
    },

    // Shark Settings
    SHARK: {
        SPAWN_INTERVAL: 400, // frames
        MAX_COUNT: 2,
        SPEED: 2.5,
        WIDTH: 350,
        HEIGHT: 230,
        WARNING_DURATION: 2000 // 2 seconds warning
    },

    // Bomb Settings
    BOMB: {
        SPAWN_INTERVAL: 150, // frames
        SPEED: 3,
        EXPLOSION_RADIUS: 80,
        WIDTH: 60,
        HEIGHT: 60
    },

    // Story
    STORY_SLIDES: [
        { 
            title: "Meet Shahd", 
            text: "This is Shahd, a brave little fish starting her journey in the deep ocean. Small but mighty, she's ready to conquer the seas!", 
            imgSrc: "assets/characters/hero1_right_closed.png",
            character: "Shahd"
        },
        { 
            title: "Tiny Hamdy", 
            text: "Hamdy is the smallest fish around - easy prey and perfect snack! Start your hunt here, but watch out, there are bigger threats lurking...", 
            imgSrc: "assets/characters/tiny-fry_right_closed.png",
            character: "Hamdy"
        },
        { 
            title: "Swift Khaled", 
            text: "Khaled the swift minnow - fast and slippery! He thinks he's smart, but you're smarter. Chase him down!", 
            imgSrc: "assets/characters/swift-minnow_right_closed.png",
            character: "Khaled"
        },
        { 
            title: "Queen Salma", 
            text: "Salma, the spotted reef queen! She's fierce, fabulous, and on FIRE! Only the brave dare to challenge her.", 
            imgSrc: "assets/characters/spotted-reef_right_closed.png",
            character: "Salma"
        },
        { 
            title: "Hunter Menna", 
            text: "Menna the Hunter - a dangerous predator with sharp instincts! She's big, bold, and always on the prowl. Approach with caution!", 
            imgSrc: "assets/characters/hunter_right_closed.png",
            character: "Menna"
        },
        { 
            title: "Apex Ahmed", 
            text: "Ahmed is the APEX predator - the ultimate boss! Defeat him and prove you're the true ruler of the ocean!", 
            imgSrc: "assets/characters/apex_right_closed.png",
            character: "Ahmed"
        },
        { 
            title: "Beware of Eng. Mahmoud!", 
            text: "Eng. Mahmoud the SHARK - the deadliest creature in the sea! He shows no mercy. When you see the warning, SWIM FOR YOUR LIFE!", 
            imgSrc: "assets/characters/shark.png",
            character: "Eng. Mahmoud"
        },
        { 
            title: "Your Mission", 
            text: "Eat smaller fish, grow bigger, and reach 650 points to enter ENDLESS MODE! Can you survive the ultimate challenge?", 
            imgSrc: "assets/characters/hero4_right_closed.png",
            character: "Shahd"
        }
    ],

    LEVEL_NAMES: ["Tiny Fish", "Hunter Fish", "Apex Fish", "Ocean King"]
};