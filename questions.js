// Question bank for the Hurling & Gaelic Football Quiz
// Each question has: q (text), emoji, options (4 strings), correct (index of right answer),
// difficulty ('easy' or 'medium'), and fact (fun explanation shown after answering)

const HURLING_QUESTIONS = [
  {
    q: "What do hurling players use to hit the sliotar (ball)?",
    emoji: "🏑",
    options: ["A hurley", "A tennis racket", "A baseball bat", "A wooden spoon"],
    correct: 0,
    difficulty: "easy",
    fact: "A hurley (or 'camán') is a curved wooden stick made from ash wood!"
  },
  {
    q: "What is the small ball used in hurling called?",
    emoji: "⚪",
    options: ["A puck", "A sliotar", "A shuttlecock", "A marble"],
    correct: 1,
    difficulty: "easy",
    fact: "The sliotar has a cork centre and a leather cover!"
  },
  {
    q: "How many players are on a hurling team during a match?",
    emoji: "👥",
    options: ["7", "11", "15", "20"],
    correct: 2,
    difficulty: "medium",
    fact: "Each team has 15 players on the pitch at once!"
  },
  {
    q: "If a player hits the sliotar OVER the crossbar, how many points do they score?",
    emoji: "🥅",
    options: ["1 point", "2 points", "3 points", "5 points"],
    correct: 0,
    difficulty: "medium",
    fact: "That's called a 'point' - it's worth 1!"
  },
  {
    q: "If a player hits the sliotar into the NET under the bar, how many points is that 'goal' worth?",
    emoji: "🥅",
    options: ["1 point", "2 points", "3 points", "0 points"],
    correct: 2,
    difficulty: "medium",
    fact: "A goal in the net is worth 3 points - a brilliant score!"
  },
  {
    q: "What must hurling players wear on their heads to stay safe?",
    emoji: "🪖",
    options: ["A sun hat", "A helmet with a face guard", "A crown", "Nothing"],
    correct: 1,
    difficulty: "easy",
    fact: "Helmets with face guards protect players' heads and faces!"
  },
  {
    q: "What shape is a hurling pitch?",
    emoji: "🏟️",
    options: ["A circle", "A triangle", "A long rectangle", "A star"],
    correct: 2,
    difficulty: "easy",
    fact: "It's a big, long grassy rectangle!"
  },
  {
    q: "What country did hurling come from?",
    emoji: "🍀",
    options: ["Ireland", "Australia", "Brazil", "Japan"],
    correct: 0,
    difficulty: "easy",
    fact: "Hurling is one of Ireland's oldest sports - thousands of years old!"
  },
  {
    q: "Can a hurling player balance the sliotar on the hurley and run with it?",
    emoji: "🏃",
    options: ["Yes", "No, never", "Only the goalkeeper", "Only on Tuesdays"],
    correct: 0,
    difficulty: "medium",
    fact: "Players balance and run with the sliotar on the hurley - it takes great skill!"
  },
  {
    q: "What shape are the goalposts in hurling?",
    emoji: "🥅",
    options: ["A circle", "An H-shape with a crossbar", "A triangle", "A square box"],
    correct: 1,
    difficulty: "easy",
    fact: "The H-shaped posts have a net below the bar and open space above it!"
  },
  {
    q: "What organisation looks after hurling in Ireland?",
    emoji: "🏛️",
    options: ["The GAA", "FIFA", "The NBA", "UEFA"],
    correct: 0,
    difficulty: "medium",
    fact: "The GAA (Gaelic Athletic Association) organises hurling and Gaelic football!"
  },
  {
    q: "What can a hurling goalkeeper use to stop the sliotar?",
    emoji: "🧤",
    options: ["Only the net", "Their hurley, hands, and body", "Only a tennis racket", "Only their feet"],
    correct: 1,
    difficulty: "medium",
    fact: "Goalkeepers can use their hurley, hands, and body to make a save!"
  }
];

const FOOTBALL_QUESTIONS = [
  {
    q: "What shape is the ball used in Gaelic football?",
    emoji: "⚽",
    options: ["Oval like a rugby ball", "Round like a soccer ball", "Square", "Triangle-shaped"],
    correct: 1,
    difficulty: "easy",
    fact: "It's round, just a little bigger and heavier than a soccer ball!"
  },
  {
    q: "How many players are on a Gaelic football team during a match?",
    emoji: "👥",
    options: ["9", "11", "13", "15"],
    correct: 3,
    difficulty: "medium",
    fact: "Just like hurling, there are 15 players on each team!"
  },
  {
    q: "If a player kicks the ball OVER the bar, between the posts, how many points?",
    emoji: "🥅",
    options: ["1 point", "2 points", "3 points", "4 points"],
    correct: 0,
    difficulty: "medium",
    fact: "That's called a 'point' and it's worth 1!"
  },
  {
    q: "If a player gets the ball into the NET, how many points is that 'goal' worth?",
    emoji: "🥅",
    options: ["1 point", "2 points", "3 points", "5 points"],
    correct: 2,
    difficulty: "medium",
    fact: "A goal in the net is worth 3 points - a fantastic score!"
  },
  {
    q: "Are players allowed to use their hands in Gaelic football?",
    emoji: "🙌",
    options: ["No, feet only", "Yes, to catch, pass and bounce the ball", "Only the referee", "Only at half-time"],
    correct: 1,
    difficulty: "easy",
    fact: "Players can catch, hand-pass, and bounce the ball with their hands!"
  },
  {
    q: "What must a player do every few steps while running with the ball?",
    emoji: "⚽",
    options: ["Throw it in the air", "Bounce it or 'solo' it on their foot", "Stop and sit down", "Pass it to the referee"],
    correct: 1,
    difficulty: "medium",
    fact: "This is called 'soloing' - bouncing or tapping the ball to keep moving with it!"
  },
  {
    q: "What shape are the goalposts in Gaelic football?",
    emoji: "🥅",
    options: ["A circle", "An H-shape with a crossbar and net", "A diamond", "A straight line"],
    correct: 1,
    difficulty: "easy",
    fact: "Same H-shaped posts as hurling - over the bar for a point, under for a goal!"
  },
  {
    q: "What country did Gaelic football come from?",
    emoji: "🍀",
    options: ["Ireland", "Canada", "Germany", "Egypt"],
    correct: 0,
    difficulty: "easy",
    fact: "Gaelic football was first organised in Ireland in the late 1800s!"
  },
  {
    q: "What organisation runs Gaelic football?",
    emoji: "🏛️",
    options: ["GAA", "FIFA", "NHL", "ICC"],
    correct: 0,
    difficulty: "medium",
    fact: "The GAA (Gaelic Athletic Association) runs both hurling and Gaelic football!"
  },
  {
    q: "What shape is a Gaelic football pitch?",
    emoji: "🏟️",
    options: ["A long rectangle", "A circle", "A triangle", "An oval"],
    correct: 0,
    difficulty: "easy",
    fact: "It's a big rectangular grass pitch, just like a hurling pitch!"
  },
  {
    q: "Is it allowed to grab an opponent's jersey to tackle them?",
    emoji: "🚫",
    options: ["Yes, anytime", "No, that's a foul", "Only the captain can", "Only in the last minute"],
    correct: 1,
    difficulty: "medium",
    fact: "Players can do a shoulder-to-shoulder challenge, but grabbing a jersey is a foul!"
  },
  {
    q: "What is the name of the biggest Gaelic football competition each year?",
    emoji: "🏆",
    options: ["The All-Ireland Championship", "The World Cup", "The Super Bowl", "The Olympics"],
    correct: 0,
    difficulty: "medium",
    fact: "Counties compete all summer long for the All-Ireland Championship trophy!"
  }
];
