// Comprehensive Trivia Puzzle Collection - Skill-Based & Legal
// General knowledge, science, history, geography, and more

const triviaPuzzles = [
    // GENERAL KNOWLEDGE
    { symbols: "🌍🇺🇸", answer: "united states", alternatives: ["united states", "usa", "america", "us"] },
    { symbols: "🌍🇬🇧", answer: "united kingdom", alternatives: ["united kingdom", "uk", "britain", "england"] },
    { symbols: "🌍🇫🇷", answer: "france", alternatives: ["france", "french", "paris"] },
    { symbols: "🌍🇩🇪", answer: "germany", alternatives: ["germany", "german", "berlin"] },
    { symbols: "🌍🇯🇵", answer: "japan", alternatives: ["japan", "japanese", "tokyo"] },
    { symbols: "🌍🇨🇳", answer: "china", alternatives: ["china", "chinese", "beijing"] },
    { symbols: "🌍🇮🇳", answer: "india", alternatives: ["india", "indian", "delhi"] },
    { symbols: "🌍🇧🇷", answer: "brazil", alternatives: ["brazil", "brazilian", "brasilia"] },
    { symbols: "🌍🇦🇺", answer: "australia", alternatives: ["australia", "australian", "sydney"] },
    { symbols: "🌍🇨🇦", answer: "canada", alternatives: ["canada", "canadian", "ottawa"] },
    
    // SCIENCE & NATURE
    { symbols: "🌞⭐", answer: "sun star", alternatives: ["sun star", "solar system", "star sun"] },
    { symbols: "🌙🌍", answer: "moon earth", alternatives: ["moon earth", "earth moon", "lunar"] },
    { symbols: "🌊🐠", answer: "ocean fish", alternatives: ["ocean fish", "sea fish", "marine life"] },
    { symbols: "🌲🦌", answer: "forest deer", alternatives: ["forest deer", "woodland deer", "wildlife"] },
    { symbols: "🏔️❄️", answer: "mountain snow", alternatives: ["mountain snow", "snow mountain", "alpine"] },
    { symbols: "🌋🌊", answer: "volcano lava", alternatives: ["volcano lava", "volcanic lava", "eruption"] },
    { symbols: "🌪️🌪️", answer: "tornado", alternatives: ["tornado", "twister", "cyclone"] },
    { symbols: "⚡🌩️", answer: "lightning thunder", alternatives: ["lightning thunder", "thunder lightning", "storm"] },
    { symbols: "🌈☔", answer: "rainbow rain", alternatives: ["rainbow rain", "rain rainbow", "weather"] },
    { symbols: "🌡️❄️", answer: "temperature cold", alternatives: ["temperature cold", "cold temperature", "freezing"] },
    
    // HISTORY
    { symbols: "🏛️🏺", answer: "ancient greece", alternatives: ["ancient greece", "greek history", "athens"] },
    { symbols: "🏛️🦅", answer: "ancient rome", alternatives: ["ancient rome", "roman empire", "rome"] },
    { symbols: "👑🏰", answer: "medieval castle", alternatives: ["medieval castle", "castle medieval", "knights"] },
    { symbols: "⚔️🛡️", answer: "warrior knight", alternatives: ["warrior knight", "knight warrior", "battle"] },
    { symbols: "🚢⚓", answer: "ship anchor", alternatives: ["ship anchor", "nautical", "sailing"] },
    { symbols: "📜✍️", answer: "ancient writing", alternatives: ["ancient writing", "historical document", "manuscript"] },
    { symbols: "🏺🏛️", answer: "ancient pottery", alternatives: ["ancient pottery", "historical artifact", "ceramic"] },
    { symbols: "👑💎", answer: "royal crown", alternatives: ["royal crown", "crown royal", "monarchy"] },
    { symbols: "⚔️🏰", answer: "castle battle", alternatives: ["castle battle", "battle castle", "siege"] },
    { symbols: "📚🏛️", answer: "ancient library", alternatives: ["ancient library", "historical books", "manuscripts"] },
    
    // GEOGRAPHY
    { symbols: "🏔️🌊", answer: "mountain lake", alternatives: ["mountain lake", "alpine lake", "highland"] },
    { symbols: "🏜️🐪", answer: "desert camel", alternatives: ["desert camel", "sahara", "arid"] },
    { symbols: "🌊🏝️", answer: "ocean island", alternatives: ["ocean island", "island ocean", "tropical"] },
    { symbols: "🌋🏔️", answer: "volcano mountain", alternatives: ["volcano mountain", "volcanic peak", "eruption"] },
    { symbols: "🌊🏖️", answer: "ocean beach", alternatives: ["ocean beach", "beach ocean", "coastal"] },
    { symbols: "🏔️❄️", answer: "mountain glacier", alternatives: ["mountain glacier", "alpine glacier", "ice"] },
    { symbols: "🌊🐋", answer: "ocean whale", alternatives: ["ocean whale", "whale ocean", "marine"] },
    { symbols: "🏜️🌵", answer: "desert cactus", alternatives: ["desert cactus", "cactus desert", "arid"] },
    { symbols: "🌊🏄‍♂️", answer: "ocean surfing", alternatives: ["ocean surfing", "surfing ocean", "waves"] },
    { symbols: "🏔️🦅", answer: "mountain eagle", alternatives: ["mountain eagle", "eagle mountain", "alpine"] },
    
    // LITERATURE & BOOKS
    { symbols: "📚✍️", answer: "book writing", alternatives: ["book writing", "writing book", "literature"] },
    { symbols: "📖🖋️", answer: "novel pen", alternatives: ["novel pen", "pen novel", "fiction"] },
    { symbols: "📚🎭", answer: "book theater", alternatives: ["book theater", "theater book", "drama"] },
    { symbols: "📖📝", answer: "story writing", alternatives: ["story writing", "writing story", "narrative"] },
    { symbols: "📚📖", answer: "library book", alternatives: ["library book", "book library", "reading"] },
    { symbols: "📖🎨", answer: "book illustration", alternatives: ["book illustration", "illustration book", "art"] },
    { symbols: "📚📚", answer: "book collection", alternatives: ["book collection", "collection books", "library"] },
    { symbols: "📖📚", answer: "reading books", alternatives: ["reading books", "books reading", "literature"] },
    { symbols: "📚✏️", answer: "book pencil", alternatives: ["book pencil", "pencil book", "writing"] },
    { symbols: "📖📖", answer: "double book", alternatives: ["double book", "two books", "reading"] },
    
    // MUSIC & ENTERTAINMENT
    { symbols: "🎵🎼", answer: "music sheet", alternatives: ["music sheet", "sheet music", "notation"] },
    { symbols: "🎸🎵", answer: "guitar music", alternatives: ["guitar music", "music guitar", "rock"] },
    { symbols: "🎹🎵", answer: "piano music", alternatives: ["piano music", "music piano", "classical"] },
    { symbols: "🎤🎵", answer: "microphone music", alternatives: ["microphone music", "music microphone", "singing"] },
    { symbols: "🎺🎵", answer: "trumpet music", alternatives: ["trumpet music", "music trumpet", "jazz"] },
    { symbols: "🎻🎵", answer: "violin music", alternatives: ["violin music", "music violin", "orchestra"] },
    { symbols: "🥁🎵", answer: "drum music", alternatives: ["drum music", "music drum", "rhythm"] },
    { symbols: "🎵🎶", answer: "music melody", alternatives: ["music melody", "melody music", "song"] },
    { symbols: "🎵🎧", answer: "music headphones", alternatives: ["music headphones", "headphones music", "audio"] },
    { symbols: "🎵📻", answer: "music radio", alternatives: ["music radio", "radio music", "broadcast"] },
    
    // SPORTS & FITNESS
    { symbols: "⚽🏆", answer: "soccer trophy", alternatives: ["soccer trophy", "football trophy", "championship"] },
    { symbols: "🏀🏆", answer: "basketball trophy", alternatives: ["basketball trophy", "trophy basketball", "championship"] },
    { symbols: "🎾🏆", answer: "tennis trophy", alternatives: ["tennis trophy", "trophy tennis", "championship"] },
    { symbols: "🏈🏆", answer: "football trophy", alternatives: ["football trophy", "trophy football", "championship"] },
    { symbols: "🏊‍♂️🏆", answer: "swimming trophy", alternatives: ["swimming trophy", "trophy swimming", "championship"] },
    { symbols: "🏃‍♂️🏆", answer: "running trophy", alternatives: ["running trophy", "trophy running", "marathon"] },
    { symbols: "🚴‍♂️🏆", answer: "cycling trophy", alternatives: ["cycling trophy", "trophy cycling", "championship"] },
    { symbols: "🏋️‍♂️🏆", answer: "weightlifting trophy", alternatives: ["weightlifting trophy", "trophy weightlifting", "championship"] },
    { symbols: "🥊🏆", answer: "boxing trophy", alternatives: ["boxing trophy", "trophy boxing", "championship"] },
    { symbols: "🏒🏆", answer: "hockey trophy", alternatives: ["hockey trophy", "trophy hockey", "championship"] },
    
    // FOOD & COOKING
    { symbols: "🍕🍕", answer: "double pizza", alternatives: ["double pizza", "two pizzas", "pizza"] },
    { symbols: "🍔🍟", answer: "burger fries", alternatives: ["burger fries", "fast food", "combo"] },
    { symbols: "☕🍰", answer: "coffee cake", alternatives: ["coffee cake", "dessert", "breakfast"] },
    { symbols: "🍕🍺", answer: "pizza beer", alternatives: ["pizza beer", "beer pizza", "party"] },
    { symbols: "🥪🥤", answer: "sandwich drink", alternatives: ["sandwich drink", "lunch", "meal"] },
    { symbols: "🍦🍪", answer: "ice cream cookie", alternatives: ["ice cream cookie", "dessert", "sweet"] },
    { symbols: "🍕🧀", answer: "pizza cheese", alternatives: ["pizza cheese", "cheese pizza", "italian"] },
    { symbols: "🍔🥤", answer: "burger drink", alternatives: ["burger drink", "fast food", "combo"] },
    { symbols: "☕🥐", answer: "coffee croissant", alternatives: ["coffee croissant", "breakfast", "french"] },
    { symbols: "🍕🍕", answer: "pizza party", alternatives: ["pizza party", "party pizza", "celebration"] },
    
    // TECHNOLOGY
    { symbols: "💻⌨️", answer: "computer keyboard", alternatives: ["computer keyboard", "pc keyboard", "typing"] },
    { symbols: "📱🔋", answer: "phone battery", alternatives: ["phone battery", "mobile battery", "power"] },
    { symbols: "🎮🕹️", answer: "game controller", alternatives: ["game controller", "gaming", "console"] },
    { symbols: "📷📸", answer: "camera photo", alternatives: ["camera photo", "photography", "picture"] },
    { symbols: "🎵🎧", answer: "music headphones", alternatives: ["music headphones", "audio", "listening"] },
    { symbols: "💻🖱️", answer: "computer mouse", alternatives: ["computer mouse", "pc mouse", "clicking"] },
    { symbols: "📱📱", answer: "double phone", alternatives: ["double phone", "two phones", "mobile"] },
    { symbols: "💻💻", answer: "double computer", alternatives: ["double computer", "two computers", "pc"] },
    { symbols: "🎮🎮", answer: "double game", alternatives: ["double game", "two games", "gaming"] },
    { symbols: "📱💻", answer: "phone computer", alternatives: ["phone computer", "mobile pc", "technology"] },
    
    // ANIMALS & WILDLIFE
    { symbols: "🐱🐶", answer: "cat dog", alternatives: ["cat dog", "pets", "animals"] },
    { symbols: "🐸👑", answer: "frog prince", alternatives: ["frog prince", "prince frog", "fairy tale"] },
    { symbols: "🐻🍯", answer: "bear honey", alternatives: ["bear honey", "honey bear", "winnie"] },
    { symbols: "🦁👑", answer: "lion king", alternatives: ["lion king", "king lion", "disney"] },
    { symbols: "🐧🐟", answer: "penguin fish", alternatives: ["penguin fish", "fish penguin", "antarctic"] },
    { symbols: "🐘🌿", answer: "elephant grass", alternatives: ["elephant grass", "grass elephant", "savanna"] },
    { symbols: "🦒🌳", answer: "giraffe tree", alternatives: ["giraffe tree", "tree giraffe", "africa"] },
    { symbols: "🐨🌿", answer: "koala eucalyptus", alternatives: ["koala eucalyptus", "eucalyptus koala", "australia"] },
    { symbols: "🐼🎋", answer: "panda bamboo", alternatives: ["panda bamboo", "bamboo panda", "china"] },
    { symbols: "🦊🐰", answer: "fox rabbit", alternatives: ["fox rabbit", "rabbit fox", "wildlife"] },
    
    // WEATHER & SEASONS
    { symbols: "🌧️☔", answer: "rain umbrella", alternatives: ["rain umbrella", "umbrella rain", "wet"] },
    { symbols: "❄️⛄", answer: "snow snowman", alternatives: ["snow snowman", "snowman snow", "winter"] },
    { symbols: "🌞☀️", answer: "sun sunny", alternatives: ["sun sunny", "sunny sun", "summer"] },
    { symbols: "🍂🍁", answer: "autumn leaves", alternatives: ["autumn leaves", "fall leaves", "season"] },
    { symbols: "🌸🌺", answer: "spring flowers", alternatives: ["spring flowers", "flowers spring", "bloom"] },
    { symbols: "🌊🌪️", answer: "ocean hurricane", alternatives: ["ocean hurricane", "hurricane ocean", "storm"] },
    { symbols: "🌡️🔥", answer: "temperature hot", alternatives: ["temperature hot", "hot temperature", "heat"] },
    { symbols: "🌧️🌧️", answer: "double rain", alternatives: ["double rain", "heavy rain", "storm"] },
    { symbols: "❄️❄️", answer: "double snow", alternatives: ["double snow", "heavy snow", "blizzard"] },
    { symbols: "☀️☀️", answer: "double sun", alternatives: ["double sun", "bright sun", "hot"] },
    
    // TRANSPORTATION
    { symbols: "🚗🚙", answer: "car truck", alternatives: ["car truck", "vehicles", "transport"] },
    { symbols: "🚲🛴", answer: "bicycle scooter", alternatives: ["bicycle scooter", "wheels", "transport"] },
    { symbols: "🚁✈️", answer: "helicopter plane", alternatives: ["helicopter plane", "aircraft", "flying"] },
    { symbols: "🚢⚓", answer: "ship anchor", alternatives: ["ship anchor", "nautical", "sailing"] },
    { symbols: "🚂🚃", answer: "train car", alternatives: ["train car", "railroad", "transport"] },
    { symbols: "🚗🚗", answer: "double car", alternatives: ["double car", "two cars", "vehicles"] },
    { symbols: "✈️✈️", answer: "double plane", alternatives: ["double plane", "two planes", "aviation"] },
    { symbols: "🚢🚢", answer: "double ship", alternatives: ["double ship", "two ships", "nautical"] },
    { symbols: "🚂🚂", answer: "double train", alternatives: ["double train", "two trains", "railroad"] },
    { symbols: "🚁🚁", answer: "double helicopter", alternatives: ["double helicopter", "two helicopters", "aviation"] },
    
    // PROFESSIONS & JOBS
    { symbols: "👨‍⚕️💊", answer: "doctor medicine", alternatives: ["doctor medicine", "medical", "healthcare"] },
    { symbols: "👨‍🍳👩‍🍳", answer: "chef chef", alternatives: ["chef chef", "cooking", "kitchen"] },
    { symbols: "👨‍🏫📚", answer: "teacher book", alternatives: ["teacher book", "education", "school"] },
    { symbols: "👨‍🚒🚒", answer: "firefighter truck", alternatives: ["firefighter truck", "fire department", "emergency"] },
    { symbols: "👨‍✈️✈️", answer: "pilot plane", alternatives: ["pilot plane", "aviation", "flying"] },
    { symbols: "👨‍🔬🧪", answer: "scientist lab", alternatives: ["scientist lab", "research", "experiment"] },
    { symbols: "👨‍💻💻", answer: "programmer computer", alternatives: ["programmer computer", "coding", "software"] },
    { symbols: "👨‍🎨🎨", answer: "artist paint", alternatives: ["artist paint", "painting", "creative"] },
    { symbols: "👨‍🏗️🏗️", answer: "builder construction", alternatives: ["builder construction", "construction", "building"] },
    { symbols: "👨‍💼💼", answer: "businessman briefcase", alternatives: ["businessman briefcase", "business", "office"] },
    
    // HOLIDAYS & CELEBRATIONS
    { symbols: "🎄🎁", answer: "christmas present", alternatives: ["christmas present", "holiday gift", "xmas"] },
    { symbols: "🎃👻", answer: "halloween ghost", alternatives: ["halloween ghost", "spooky", "october"] },
    { symbols: "💝💐", answer: "gift flowers", alternatives: ["gift flowers", "present bouquet", "celebration"] },
    { symbols: "🎂🕯️", answer: "birthday cake", alternatives: ["birthday cake", "celebration", "party"] },
    { symbols: "🎊🎉", answer: "party celebration", alternatives: ["party celebration", "festival", "celebration"] },
    { symbols: "🎄🎄", answer: "double christmas", alternatives: ["double christmas", "two christmas", "holiday"] },
    { symbols: "🎃🎃", answer: "double halloween", alternatives: ["double halloween", "two halloween", "spooky"] },
    { symbols: "🎂🎂", answer: "double birthday", alternatives: ["double birthday", "two birthdays", "celebration"] },
    { symbols: "🎁🎁", answer: "double gift", alternatives: ["double gift", "two gifts", "presents"] },
    { symbols: "🎉🎉", answer: "double party", alternatives: ["double party", "two parties", "celebration"] },
    
    // MATHEMATICS & NUMBERS
    { symbols: "1️⃣2️⃣3️⃣", answer: "one two three", alternatives: ["one two three", "123", "numbers"] },
    { symbols: "🔴🟡🔵", answer: "red yellow blue", alternatives: ["red yellow blue", "primary colors", "rgb"] },
    { symbols: "⭐⭐⭐", answer: "three stars", alternatives: ["three stars", "threestars", "star trio"] },
    { symbols: "🎲🎲🎲", answer: "three dice", alternatives: ["three dice", "threedice", "dice trio"] },
    { symbols: "🕐🕑🕒", answer: "one two three", alternatives: ["one two three", "time sequence", "clock order"] },
    { symbols: "🔢➕", answer: "number plus", alternatives: ["number plus", "addition", "math"] },
    { symbols: "🔢➖", answer: "number minus", alternatives: ["number minus", "subtraction", "math"] },
    { symbols: "🔢✖️", answer: "number multiply", alternatives: ["number multiply", "multiplication", "math"] },
    { symbols: "🔢➗", answer: "number divide", alternatives: ["number divide", "division", "math"] },
    { symbols: "🔢=", answer: "number equals", alternatives: ["number equals", "equation", "math"] },
    
    // COLORS & ART
    { symbols: "🎨🖌️", answer: "paint brush", alternatives: ["paint brush", "painting", "art"] },
    { symbols: "🖼️🎨", answer: "picture art", alternatives: ["picture art", "art picture", "painting"] },
    { symbols: "🖌️🎨", answer: "brush paint", alternatives: ["brush paint", "paint brush", "art"] },
    { symbols: "🎨🎨", answer: "double art", alternatives: ["double art", "two arts", "creative"] },
    { symbols: "🖼️🖼️", answer: "double picture", alternatives: ["double picture", "two pictures", "art"] },
    { symbols: "🖌️🖌️", answer: "double brush", alternatives: ["double brush", "two brushes", "painting"] },
    { symbols: "🎨🖼️", answer: "art picture", alternatives: ["art picture", "picture art", "creative"] },
    { symbols: "🖌️🖼️", answer: "brush picture", alternatives: ["brush picture", "picture brush", "art"] },
    { symbols: "🎨🖌️", answer: "art brush", alternatives: ["art brush", "brush art", "creative"] },
    { symbols: "🖼️🎨", answer: "picture art", alternatives: ["picture art", "art picture", "creative"] }
];

module.exports = triviaPuzzles;
