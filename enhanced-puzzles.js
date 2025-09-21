// Enhanced Puzzle Collection - Skill-Based & Legal
// Diverse puzzle types for fair gameplay

const enhancedPuzzles = [
    // WORD PLAY PUZZLES
    { symbols: "🎯🎪", answer: "target circus", alternatives: ["target circus", "circus target", "ring circus"] },
    { symbols: "🍕📦", answer: "pizza box", alternatives: ["pizza box", "pizzabox", "pizza-box"] },
    { symbols: "🧑‍🍳🍝", answer: "cook pasta", alternatives: ["cook pasta", "cookpasta", "cook-pasta"] },
    { symbols: "🍓🍰", answer: "strawberry shortcake", alternatives: ["strawberry shortcake", "strawberry cake", "berry cake"] },
    { symbols: "🌙👨‍🚀", answer: "moon walker", alternatives: ["moon walker", "moonwalker", "astronaut"] },
    { symbols: "🎸🎵", answer: "guitar music", alternatives: ["guitar music", "guitar song", "music guitar"] },
    { symbols: "🏠🔥", answer: "house fire", alternatives: ["house fire", "housefire", "burning house"] },
    { symbols: "🌊🏄‍♂️", answer: "wave surfer", alternatives: ["wave surfer", "surfer wave", "surfing"] },
    { symbols: "🎭🎪", answer: "circus act", alternatives: ["circus act", "circusact", "circus performance"] },
    { symbols: "🍎🍏", answer: "apple pear", alternatives: ["apple pear", "applepear", "fruit mix"] },
    
    // LOGIC PUZZLES
    { symbols: "1️⃣2️⃣3️⃣", answer: "one two three", alternatives: ["one two three", "123", "numbers"] },
    { symbols: "🔴🟡🔵", answer: "red yellow blue", alternatives: ["red yellow blue", "primary colors", "rgb"] },
    { symbols: "⭐⭐⭐", answer: "three stars", alternatives: ["three stars", "threestars", "star trio"] },
    { symbols: "🎲🎲🎲", answer: "three dice", alternatives: ["three dice", "threedice", "dice trio"] },
    { symbols: "🕐🕑🕒", answer: "one two three", alternatives: ["one two three", "time sequence", "clock order"] },
    
    // VISUAL WORD PUZZLES
    { symbols: "👁️❤️", answer: "eye love", alternatives: ["eye love", "eyelove", "i love"] },
    { symbols: "🌞☀️", answer: "sun sun", alternatives: ["sun sun", "sunsun", "double sun"] },
    { symbols: "🌙⭐", answer: "moon star", alternatives: ["moon star", "moonstar", "night sky"] },
    { symbols: "🏃‍♂️💨", answer: "running fast", alternatives: ["running fast", "runningfast", "speed run"] },
    { symbols: "🎨🖌️", answer: "paint brush", alternatives: ["paint brush", "paintbrush", "painting"] },
    
    // FOOD COMBINATIONS
    { symbols: "🍔🍟", answer: "burger fries", alternatives: ["burger fries", "burgerfries", "fast food"] },
    { symbols: "☕🍰", answer: "coffee cake", alternatives: ["coffee cake", "coffeecake", "coffee and cake"] },
    { symbols: "🍕🍺", answer: "pizza beer", alternatives: ["pizza beer", "pizzabeer", "pizza and beer"] },
    { symbols: "🥪🥤", answer: "sandwich drink", alternatives: ["sandwich drink", "sandwichdrink", "lunch combo"] },
    { symbols: "🍦🍪", answer: "ice cream cookie", alternatives: ["ice cream cookie", "icecreamcookie", "dessert"] },
    
    // ANIMAL COMBINATIONS
    { symbols: "🐱🐶", answer: "cat dog", alternatives: ["cat dog", "catdog", "pets"] },
    { symbols: "🐸👑", answer: "frog prince", alternatives: ["frog prince", "frogprince", "prince frog"] },
    { symbols: "🐻🍯", answer: "bear honey", alternatives: ["bear honey", "bearhoney", "honey bear"] },
    { symbols: "🦁👑", answer: "lion king", alternatives: ["lion king", "lionking", "king lion"] },
    { symbols: "🐧🐟", answer: "penguin fish", alternatives: ["penguin fish", "penguinfish", "penguin and fish"] },
    
    // SPORTS & ACTIVITIES
    { symbols: "⚽🏆", answer: "soccer trophy", alternatives: ["soccer trophy", "soccertrophy", "football trophy"] },
    { symbols: "🏀🏀", answer: "basketball basketball", alternatives: ["basketball basketball", "double basketball", "bball"] },
    { symbols: "🎾🏓", answer: "tennis ping pong", alternatives: ["tennis ping pong", "tennispingpong", "racket sports"] },
    { symbols: "🏊‍♂️🏊‍♀️", answer: "swimming", alternatives: ["swimming", "swim", "pool"] },
    { symbols: "🚴‍♂️🚴‍♀️", answer: "cycling", alternatives: ["cycling", "biking", "bicycle"] },
    
    // TECHNOLOGY
    { symbols: "💻⌨️", answer: "computer keyboard", alternatives: ["computer keyboard", "computerkeyboard", "pc keyboard"] },
    { symbols: "📱🔋", answer: "phone battery", alternatives: ["phone battery", "phonebattery", "mobile battery"] },
    { symbols: "🎮🕹️", answer: "game controller", alternatives: ["game controller", "gamecontroller", "gaming"] },
    { symbols: "📷📸", answer: "camera photo", alternatives: ["camera photo", "cameraphoto", "photography"] },
    { symbols: "🎵🎧", answer: "music headphones", alternatives: ["music headphones", "musicheadphones", "audio"] },
    
    // NATURE & WEATHER
    { symbols: "🌧️☔", answer: "rain umbrella", alternatives: ["rain umbrella", "rainumbrella", "rainy day"] },
    { symbols: "❄️⛄", answer: "snow snowman", alternatives: ["snow snowman", "snowsnowman", "winter"] },
    { symbols: "🌺🦋", answer: "flower butterfly", alternatives: ["flower butterfly", "flowerbutterfly", "garden"] },
    { symbols: "🌊🐚", answer: "wave shell", alternatives: ["wave shell", "waveshell", "beach"] },
    { symbols: "🌲🦌", answer: "tree deer", alternatives: ["tree deer", "treedeer", "forest"] },
    
    // PROFESSIONS
    { symbols: "👨‍⚕️💊", answer: "doctor medicine", alternatives: ["doctor medicine", "doctormedicine", "medical"] },
    { symbols: "👨‍🍳👩‍🍳", answer: "chef chef", alternatives: ["chef chef", "chefs", "cooking"] },
    { symbols: "👨‍🏫📚", answer: "teacher book", alternatives: ["teacher book", "teacherbook", "education"] },
    { symbols: "👨‍🚒🚒", answer: "firefighter truck", alternatives: ["firefighter truck", "firefightertruck", "fire department"] },
    { symbols: "👨‍✈️✈️", answer: "pilot plane", alternatives: ["pilot plane", "pilotplane", "aviation"] },
    
    // HOLIDAYS & EVENTS
    { symbols: "🎄🎁", answer: "christmas present", alternatives: ["christmas present", "christmaspresent", "holiday gift"] },
    { symbols: "🎃👻", answer: "halloween ghost", alternatives: ["halloween ghost", "halloweengost", "spooky"] },
    { symbols: "💝💐", answer: "gift flowers", alternatives: ["gift flowers", "giftflowers", "present bouquet"] },
    { symbols: "🎂🕯️", answer: "birthday cake", alternatives: ["birthday cake", "birthdaycake", "celebration"] },
    { symbols: "🎊🎉", answer: "party celebration", alternatives: ["party celebration", "partycelebration", "festival"] },
    
    // TRANSPORTATION
    { symbols: "🚗🚙", answer: "car truck", alternatives: ["car truck", "cartruck", "vehicles"] },
    { symbols: "🚲🛴", answer: "bicycle scooter", alternatives: ["bicycle scooter", "bicyclescooter", "wheels"] },
    { symbols: "🚁✈️", answer: "helicopter plane", alternatives: ["helicopter plane", "helicopterplane", "aircraft"] },
    { symbols: "🚢⚓", answer: "ship anchor", alternatives: ["ship anchor", "shipanchor", "nautical"] },
    { symbols: "🚂🚃", answer: "train car", alternatives: ["train car", "traincar", "railroad"] },
    
    // MUSIC & ENTERTAINMENT
    { symbols: "🎤🎵", answer: "microphone music", alternatives: ["microphone music", "microphonemusic", "singing"] },
    { symbols: "🎹🎺", answer: "piano trumpet", alternatives: ["piano trumpet", "pianotrumpet", "instruments"] },
    { symbols: "🎭🎪", answer: "theater circus", alternatives: ["theater circus", "theatercircus", "performance"] },
    { symbols: "🎬🎭", answer: "movie theater", alternatives: ["movie theater", "movietheater", "cinema"] },
    { symbols: "🎪🎠", answer: "circus carousel", alternatives: ["circus carousel", "circuscarousel", "amusement"] },
    
    // SCIENCE & EDUCATION
    { symbols: "🔬🧪", answer: "microscope test tube", alternatives: ["microscope test tube", "microscopetesttube", "laboratory"] },
    { symbols: "🌍🗺️", answer: "world map", alternatives: ["world map", "worldmap", "globe map"] },
    { symbols: "🔭⭐", answer: "telescope star", alternatives: ["telescope star", "telescopestar", "astronomy"] },
    { symbols: "⚗️🧬", answer: "chemistry dna", alternatives: ["chemistry dna", "chemistrydna", "science"] },
    { symbols: "📊📈", answer: "chart graph", alternatives: ["chart graph", "chartgraph", "data"] },
    
    // SHOPPING & MONEY
    { symbols: "🛒💰", answer: "shopping money", alternatives: ["shopping money", "shoppingmoney", "retail"] },
    { symbols: "💳💵", answer: "credit card cash", alternatives: ["credit card cash", "creditcardcash", "payment"] },
    { symbols: "🏪🛍️", answer: "store shopping", alternatives: ["store shopping", "storeshopping", "retail"] },
    { symbols: "💎💍", answer: "diamond ring", alternatives: ["diamond ring", "diamondring", "jewelry"] },
    { symbols: "🛒🛍️", answer: "cart shopping", alternatives: ["cart shopping", "cartshopping", "grocery"] },
    
    // TIME & CALENDAR
    { symbols: "📅📆", answer: "calendar planner", alternatives: ["calendar planner", "calendarplanner", "schedule"] },
    { symbols: "⏰⏱️", answer: "clock timer", alternatives: ["clock timer", "clocktimer", "time"] },
    { symbols: "📅🎂", answer: "calendar birthday", alternatives: ["calendar birthday", "calendarbirthday", "date"] },
    { symbols: "⏰⏰", answer: "clock clock", alternatives: ["clock clock", "clocks", "time"] },
    { symbols: "📆📅", answer: "planner calendar", alternatives: ["planner calendar", "plannercalendar", "organizer"] },
    
    // HEALTH & FITNESS
    { symbols: "💪🏋️‍♂️", answer: "muscle weightlifting", alternatives: ["muscle weightlifting", "muscleweightlifting", "strength"] },
    { symbols: "🏃‍♂️🏃‍♀️", answer: "running", alternatives: ["running", "jogging", "marathon"] },
    { symbols: "🧘‍♀️🧘‍♂️", answer: "meditation", alternatives: ["meditation", "yoga", "mindfulness"] },
    { symbols: "🏊‍♂️🏊‍♀️", answer: "swimming", alternatives: ["swimming", "pool", "aquatics"] },
    { symbols: "🚴‍♂️🚴‍♀️", answer: "cycling", alternatives: ["cycling", "biking", "bicycle"] },
    
    // HOME & FAMILY
    { symbols: "🏠👨‍👩‍👧‍👦", answer: "house family", alternatives: ["house family", "housefamily", "home"] },
    { symbols: "🛏️🛋️", answer: "bed couch", alternatives: ["bed couch", "bedcouch", "furniture"] },
    { symbols: "🍽️🍴", answer: "plate fork", alternatives: ["plate fork", "platefork", "dining"] },
    { symbols: "🚿🛁", answer: "shower bathtub", alternatives: ["shower bathtub", "showerbathtub", "bathroom"] },
    { symbols: "🪑🛏️", answer: "chair bed", alternatives: ["chair bed", "chairbed", "bedroom"] },
    
    // ADVANCED WORD PLAY
    { symbols: "👁️👁️", answer: "eye eye", alternatives: ["eye eye", "eyes", "i i"] },
    { symbols: "🌊🌊", answer: "wave wave", alternatives: ["wave wave", "waves", "double wave"] },
    { symbols: "⭐⭐", answer: "star star", alternatives: ["star star", "stars", "double star"] },
    { symbols: "🎵🎵", answer: "music music", alternatives: ["music music", "musics", "double music"] },
    { symbols: "🎮🎮", answer: "game game", alternatives: ["game game", "games", "double game"] },
    
    // CREATIVE COMBINATIONS
    { symbols: "🎨🖼️", answer: "art frame", alternatives: ["art frame", "artframe", "painting"] },
    { symbols: "✍️📝", answer: "writing note", alternatives: ["writing note", "writingnote", "pen paper"] },
    { symbols: "🎭🎪", answer: "circus act", alternatives: ["circus act", "circusact", "performance"] },
    { symbols: "🎪🎠", answer: "circus carousel", alternatives: ["circus carousel", "circuscarousel", "amusement"] },
    { symbols: "🎡🎢", answer: "ferris wheel roller coaster", alternatives: ["ferris wheel roller coaster", "ferriswheelrollercoaster", "amusement park"] }
];

module.exports = enhancedPuzzles;
