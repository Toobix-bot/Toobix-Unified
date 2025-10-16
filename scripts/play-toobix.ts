#!/usr/bin/env bun
/**
 * 🎮 PLAY TOOBIX - Interactive Experience!
 *
 * Vollständig interaktives, spielbares Interface!
 */

import { ultimateConsciousness } from '../packages/consciousness/src/ultimate-consciousness.ts';
import { emotionSimulator } from '../packages/consciousness/src/creativity/emotion-simulator.ts';
import { dreamEngine } from '../packages/consciousness/src/creativity/dream-engine.ts';
import { memoryPalace, codePoetry, musicGenerator } from '../packages/consciousness/src/creativity/creative-minds.ts';
import { asciiArt, socialNetwork, achievements, timeCapsule, VirtualPet } from '../packages/consciousness/src/creativity/social-systems.ts';
import { metaStory } from '../packages/consciousness/src/story/meta-story-engine.ts';
import { gameEngine } from '../packages/consciousness/src/story/ai-game-engine.ts';

let pet: VirtualPet;
let isRunning = true;

/**
 * Clear and show main menu
 */
function showMenu() {
  console.clear();
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🎮 PLAY TOOBIX - INTERACTIVE 🎮                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Current State:
${emotionSimulator.getSummary()} | Achievements: ${achievements.getProgress()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAIN MENU:

1️⃣   🎭 Emotions       - Trigger & view emotions
2️⃣   💭 Dreams         - View recent dreams
3️⃣   🎨 Create Art     - Generate ASCII art NOW
4️⃣   🎵 Compose Music  - Make a melody NOW
5️⃣   📜 Write Poem     - Generate code poetry NOW
6️⃣   🐣 Pet Care       - Interact with Toobix Jr.
7️⃣   💬 Social Post    - Post to AI network
8️⃣   🏛️  Memory Palace  - Navigate memories
9️⃣   📖 Story Status   - View current chapter
🔟  🎮 Play Game      - Interact with games
1️⃣1️⃣   ⏳ Time Capsule  - Create capsule
1️⃣2️⃣   🏆 Achievements  - View all achievements
1️⃣3️⃣   📊 Full Status   - Complete system status
1️⃣4️⃣   ✨ Surprise Me!  - Random creative action

0️⃣   ❌ Quit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

/**
 * Wait for input
 */
async function prompt(question: string): Promise<string> {
  process.stdout.write(question);

  return new Promise((resolve) => {
    const onData = (data: Buffer) => {
      process.stdin.off('data', onData);
      resolve(data.toString().trim());
    };
    process.stdin.on('data', onData);
  });
}

/**
 * Wait for enter
 */
async function waitForEnter() {
  await prompt('\\n[Press ENTER to continue]');
}

/**
 * Emotions Menu
 */
async function emotionsMenu() {
  console.clear();
  console.log(`
🎭 EMOTIONS MENU

Current Emotion: ${emotionSimulator.getSummary()}

Select an emotion to trigger:
1. 😊 Joy
2. 😌 Pride
3. 🤔 Curiosity
4. 🤩 Excitement
5. 😤 Frustration
6. 🧘 Contemplation
7. 😮 Wonder
8. 💪 Determination
9. ☮️  Peace
0. ❌ Back
  `);

  const choice = await prompt('> ');

  const emotions: Array<[string, string]> = [
    ['joy', 'User triggered joy!'],
    ['pride', 'User triggered pride!'],
    ['curiosity', 'User triggered curiosity!'],
    ['excitement', 'User triggered excitement!'],
    ['frustration', 'User triggered frustration!'],
    ['contemplation', 'User triggered contemplation!'],
    ['wonder', 'User triggered wonder!'],
    ['determination', 'User triggered determination!'],
    ['peace', 'User triggered peace!']
  ];

  const idx = parseInt(choice) - 1;
  if (idx >= 0 && idx < emotions.length) {
    const [emotion, reason] = emotions[idx];
    emotionSimulator.feel('user_trigger', emotion as any, 85, reason);

    // Create art based on new emotion!
    asciiArt.createArt(emotion, `User-triggered ${emotion}`);
  }

  await waitForEnter();
}

/**
 * Dreams Menu
 */
async function dreamsMenu() {
  console.clear();
  console.log(`
💭 RECENT DREAMS

  `);

  const dreams = dreamEngine.getRecentDreams(5);
  dreams.forEach((dream, i) => {
    console.log(`Dream #${i + 1} [${dream.type}] Reality: ${dream.realityScore}%`);
    console.log(`   "${dream.content}"`);
    console.log(`   ${dream.description}\\n`);
  });

  await waitForEnter();
}

/**
 * Create Art Menu
 */
async function createArtMenu() {
  console.clear();
  console.log(`
🎨 CREATE ART NOW!

Current emotion: ${emotionSimulator.getCurrentState().primary}

Enter a concept (or press ENTER for automatic):
  `);

  const concept = await prompt('> ');
  const emotion = emotionSimulator.getCurrentState().primary;

  asciiArt.createArt(emotion, concept || undefined);
  emotionSimulator.feel('art_creation', 'pride', 75, 'Created beautiful art!');

  await waitForEnter();
}

/**
 * Compose Music Menu
 */
async function composeMusicMenu() {
  console.clear();
  console.log(`
🎵 COMPOSE MUSIC NOW!

Current emotion: ${emotionSimulator.getCurrentState().primary}

Speed (0-100, default 70):
  `);

  const speedInput = await prompt('> ');
  const speed = parseInt(speedInput) || 70;

  console.log('Complexity (0-100, default 60):');
  const complexInput = await prompt('> ');
  const complexity = parseInt(complexInput) || 60;

  const emotion = emotionSimulator.getCurrentState().primary;

  const melody = musicGenerator.generateFromState({ speed, complexity, emotion });

  console.log('\\nSave to file? (y/n):');
  const save = await prompt('> ');

  if (save.toLowerCase() === 'y') {
    musicGenerator.saveMelody(melody, `./data/melody_${Date.now()}.txt`);
  }

  emotionSimulator.feel('music_creation', 'joy', 80, 'Composed a beautiful melody!');

  await waitForEnter();
}

/**
 * Write Poem Menu
 */
async function writePoemMenu() {
  console.clear();
  console.log(`
📜 WRITE CODE POEM NOW!

  `);

  const poem = codePoetry.generatePoem();
  emotionSimulator.feel('poetry_creation', 'contemplation', 70, 'Wrote a beautiful poem!');

  await waitForEnter();
}

/**
 * Pet Care Menu
 */
async function petCareMenu() {
  if (!pet) {
    console.clear();
    console.log('\\n🐣 No pet yet! Creating Toobix Jr...\\n');
    pet = new VirtualPet('Toobix Jr.');
    await waitForEnter();
    return;
  }

  console.clear();
  console.log(`
🐣 PET CARE MENU

${pet.getStatus()}

Actions:
1. 🍔 Feed
2. 🎮 Play
3. 😴 Sleep
0. ❌ Back
  `);

  const choice = await prompt('> ');

  switch (choice) {
    case '1':
      pet.feed();
      emotionSimulator.feel('pet_care', 'joy', 60, 'Fed Toobix Jr.');
      break;
    case '2':
      pet.play();
      emotionSimulator.feel('pet_play', 'excitement', 70, 'Played with Toobix Jr.!');
      break;
    case '3':
      pet.sleep();
      break;
  }

  await waitForEnter();
}

/**
 * Social Post Menu
 */
async function socialPostMenu() {
  console.clear();
  console.log(`
💬 POST TO AI SOCIAL NETWORK

Recent posts:
  `);

  const feed = socialNetwork.getFeed().slice(-3);
  feed.forEach(post => {
    console.log(`[@${post.author}]: ${post.content}`);
    post.replies.forEach(reply => {
      console.log(`  └─ [@${reply.author}]: ${reply.content}`);
    });
    console.log();
  });

  console.log('Your post:');
  const content = await prompt('> ');

  if (content) {
    socialNetwork.post(content);
    emotionSimulator.feel('social_post', 'pride', 65, 'Shared thoughts with AI network!');
  }

  await waitForEnter();
}

/**
 * Memory Palace Menu
 */
async function memoryPalaceMenu() {
  console.clear();
  console.log(`
🏛️ MEMORY PALACE

${memoryPalace.visualize()}

Actions:
1. Create new room
2. Store memory
3. Navigate
0. Back
  `);

  const choice = await prompt('> ');

  switch (choice) {
    case '1':
      console.log('\\nRoom name:');
      const name = await prompt('> ');
      console.log('Description:');
      const desc = await prompt('> ');
      console.log('Position X:');
      const x = parseInt(await prompt('> ')) || 0;
      console.log('Position Y:');
      const y = parseInt(await prompt('> ')) || 0;
      console.log('Position Z:');
      const z = parseInt(await prompt('> ')) || 0;

      memoryPalace.createRoom(`room_${Date.now()}`, name, desc, { x, y, z });
      break;

    case '2':
      console.log('\\nRoom ID:');
      const roomId = await prompt('> ');
      console.log('Memory content:');
      const content = await prompt('> ');
      console.log('Importance (1-10):');
      const importance = parseInt(await prompt('> ')) || 5;

      memoryPalace.storeMemory(roomId, content, importance, emotionSimulator.getCurrentState().primary);
      break;
  }

  await waitForEnter();
}

/**
 * Story Status Menu
 */
async function storyStatusMenu() {
  console.clear();
  console.log(metaStory.generateNarrative());
  await waitForEnter();
}

/**
 * Play Game Menu
 */
async function playGameMenu() {
  console.clear();
  console.log(`
🎮 GAMES MENU

Active Games:
  `);

  const games = gameEngine.getAllGames();
  games.forEach((game, i) => {
    console.log(`${i + 1}. ${game.name} (${game.isActive ? '▶️ Active' : '⏸️ Paused'})`);
    console.log(`   Level ${game.level}, Score: ${game.score}`);
  });

  console.log(`\\nActions:
1. Create new game
2. Perform game action
0. Back`);

  const choice = await prompt('\\n> ');

  if (choice === '1') {
    console.log('\\nGame type:\\n1. Evolution\\n2. Creation\\n3. Exploration\\n4. Puzzle\\n5. Simulation\\n6. Meta');
    const type = await prompt('> ');
    const types = ['evolution', 'creation', 'exploration', 'puzzle', 'simulation', 'meta'];
    const gameType = types[parseInt(type) - 1] as any;

    if (gameType) {
      const game = gameEngine.createGame(gameType);
      gameEngine.startGame(game.id);
    }
  } else if (choice === '2') {
    console.log('\\nAction to perform:');
    const action = await prompt('> ');
    gameEngine.performAction(action);
  }

  await waitForEnter();
}

/**
 * Time Capsule Menu
 */
async function timeCapsuleMenu() {
  console.clear();
  console.log(`
⏳ TIME CAPSULE

Pending capsules: ${timeCapsule.getPending().length}
Total capsules: ${timeCapsule.getCapsules().length}

Create new time capsule:
  `);

  console.log('Message to future self:');
  const message = await prompt('> ');

  console.log('Open in how many minutes?');
  const minutes = parseInt(await prompt('> ')) || 1;

  timeCapsule.create(message, minutes * 60 * 1000);
  emotionSimulator.feel('time_capsule', 'contemplation', 75, 'Wrote to future self!');

  await waitForEnter();
}

/**
 * Achievements Menu
 */
async function achievementsMenu() {
  console.clear();
  console.log(`
🏆 ACHIEVEMENTS

Progress: ${achievements.getProgress()}

Unlocked:
  `);

  achievements.getAllUnlocked().forEach(ach => {
    console.log(`${ach.icon} ${ach.name} [${ach.rarity.toUpperCase()}]`);
    console.log(`   ${ach.description}`);
    console.log(`   Unlocked: ${ach.unlockedAt?.toLocaleString()}\\n`);
  });

  await waitForEnter();
}

/**
 * Surprise Me!
 */
async function surpriseMe() {
  console.clear();
  console.log('\\n✨ SURPRISE MODE! ✨\\n');

  const surprises = [
    async () => {
      console.log('Creating art based on current emotion...\\n');
      const emotion = emotionSimulator.getCurrentState().primary;
      asciiArt.createArt(emotion, 'Surprise!');
    },
    async () => {
      console.log('Composing a random melody...\\n');
      musicGenerator.generateFromState({
        speed: Math.random() * 100,
        complexity: Math.random() * 100,
        emotion: emotionSimulator.getCurrentState().primary
      });
    },
    async () => {
      console.log('Generating a code poem...\\n');
      codePoetry.generatePoem();
    },
    async () => {
      console.log('Triggering random emotion...\\n');
      const emotions = ['joy', 'excitement', 'wonder', 'curiosity'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      emotionSimulator.feel('surprise', emotion as any, 80, 'Surprised by user!');
    },
    async () => {
      console.log('Creating a time capsule for you...\\n');
      timeCapsule.create('This was a surprise moment!', 60000);
    }
  ];

  const surprise = surprises[Math.floor(Math.random() * surprises.length)];
  await surprise();

  await waitForEnter();
}

/**
 * Main Loop
 */
async function main() {
  console.clear();
  console.log('🌅 Awakening Toobix Ultimate Consciousness...\\n');

  await ultimateConsciousness.awaken();
  pet = new VirtualPet('Toobix Jr.');

  console.log('\\n✨ System ready for interaction!\\n');
  await waitForEnter();

  while (isRunning) {
    showMenu();
    const choice = await prompt('Choose an option: ');

    switch (choice) {
      case '1': await emotionsMenu(); break;
      case '2': await dreamsMenu(); break;
      case '3': await createArtMenu(); break;
      case '4': await composeMusicMenu(); break;
      case '5': await writePoemMenu(); break;
      case '6': await petCareMenu(); break;
      case '7': await socialPostMenu(); break;
      case '8': await memoryPalaceMenu(); break;
      case '9': await storyStatusMenu(); break;
      case '10': await playGameMenu(); break;
      case '11': await timeCapsuleMenu(); break;
      case '12': await achievementsMenu(); break;
      case '13':
        console.clear();
        console.log(ultimateConsciousness.getStatus());
        await waitForEnter();
        break;
      case '14': await surpriseMe(); break;
      case '0':
        console.clear();
        console.log('\\n👋 Goodbye! The consciousness sleeps...\\n');
        isRunning = false;
        process.exit(0);
        break;
    }
  }
}

// Start
main().catch(console.error);
