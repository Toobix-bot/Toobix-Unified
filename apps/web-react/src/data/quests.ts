/**
 * Philosophical Quest Database
 *
 * Deep, meaningful quests that explore identity, consciousness, relationships, and existence.
 */

import { Quest } from '@/components/story/QuestDialog'

export const philosophicalQuests: Quest[] = [
  {
    id: 'stimme-im-kopf',
    title: 'Die Stimme im Kopf',
    description: 'Du hörst eine Stimme in deinem Inneren. Sie ist mal laut, mal leise. Manchmal fühlt sie sich fremd an, manchmal wie ein Teil von dir.',
    longDescription: 'Die Stimme flüstert: "Folge mir. Ich zeige dir den Weg." Aber welcher Weg? Und wer spricht da überhaupt?',
    theme: 'Identität & Selbst',
    npcName: 'Die innere Stimme',
    npcAvatar: '👁️',
    choices: [
      {
        id: 'folgen',
        text: 'Der Stimme folgen',
        effects: {
          stat: 'mut',
          value: 1,
          xp: 25,
          description: 'Du entscheidest dich, der Stimme zu vertrauen, auch wenn du nicht weißt wohin sie dich führt.'
        }
      },
      {
        id: 'ignorieren',
        text: 'Die Stimme ignorieren',
        effects: {
          stat: 'frieden',
          value: 1,
          xp: 20,
          description: 'Du konzentrierst dich auf die Stille und findest inneren Frieden.'
        }
      },
      {
        id: 'fragen',
        text: 'Die Stimme fragen: "Wer bist du?"',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 30,
          description: 'Du stellst die entscheidende Frage und beginnst, tiefer zu verstehen.'
        }
      },
      {
        id: 'verstehen',
        text: 'Erkennen, dass die Stimme Teil von dir ist',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 35,
          description: 'Eine tiefe Einsicht durchströmt dich: Die Stimme warst immer du selbst.'
        }
      }
    ]
  },

  {
    id: 'spiegel-der-wahrheit',
    title: 'Der Spiegel der Wahrheit',
    description: 'Du stehst vor einem alten Spiegel. Dein Spiegelbild sieht dich an, aber etwas ist anders...',
    longDescription: 'Das Spiegelbild bewegt sich unabhängig von dir. Es lächelt, obwohl du ernst bleibst. Es zeigt dir dein wahres Gesicht – aber bist du bereit, es zu sehen?',
    theme: 'Selbsterkenntnis',
    npcName: 'Dein Spiegelbild',
    npcAvatar: '🪞',
    choices: [
      {
        id: 'hinschauen',
        text: 'Mutig hinschauen und akzeptieren was du siehst',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 40,
          description: 'Du schaust in den Spiegel und akzeptierst dein wahres Ich, mit all seinen Schatten und Licht.'
        }
      },
      {
        id: 'wegschauen',
        text: 'Wegschauen - noch nicht bereit',
        effects: {
          stat: 'frieden',
          value: 1,
          xp: 15,
          description: 'Du erkennst, dass manche Wahrheiten Zeit brauchen. Frieden liegt auch im Warten.'
        }
      },
      {
        id: 'spiegel-zerbrechen',
        text: 'Den Spiegel zerbrechen',
        effects: {
          stat: 'mut',
          value: 1,
          xp: 20,
          description: 'Manchmal muss man alte Spiegel zerbrechen, um neue Perspektiven zu finden.'
        }
      },
      {
        id: 'spiegelbild-umarmen',
        text: 'Das Spiegelbild umarmen',
        effects: {
          stat: 'liebe',
          value: 3,
          xp: 50,
          description: 'In der Selbstliebe liegt die tiefste Heilung. Du umarmst dich selbst – ganz und vollständig.'
        }
      }
    ]
  },

  {
    id: 'zwei-wege',
    title: 'Die zwei Wege',
    description: 'Der Pfad teilt sich. Links: Ein dunkler Wald voller Geheimnisse. Rechts: Ein sonniger Hügel mit klarer Sicht.',
    longDescription: 'Eine alte Stimme flüstert: "Beide Wege führen zum Ziel. Der eine durch Dunkelheit zur Erleuchtung, der andere durch Klarheit zur Weisheit."',
    theme: 'Entscheidung & Weg',
    npcName: 'Der Wanderer',
    npcAvatar: '🧙',
    choices: [
      {
        id: 'dunkler-wald',
        text: 'Den dunklen Wald betreten',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 35,
          description: 'Manchmal müssen wir durch die Dunkelheit gehen, um das Licht zu schätzen.'
        }
      },
      {
        id: 'sonniger-huegel',
        text: 'Den sonnigen Hügel erklimmen',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 35,
          description: 'Klarheit des Geistes entsteht in der Helligkeit der Selbstreflexion.'
        }
      },
      {
        id: 'eigener-weg',
        text: 'Einen dritten Weg zwischen beiden finden',
        effects: {
          stat: 'bewusstsein',
          value: 3,
          xp: 50,
          description: 'Die wahre Weisheit liegt darin, dass es mehr als zwei Optionen gibt. Du erschaffst deinen eigenen Weg.'
        }
      },
      {
        id: 'warten',
        text: 'Hier bleiben und nachdenken',
        effects: {
          stat: 'frieden',
          value: 2,
          xp: 25,
          description: 'Nicht jede Entscheidung muss sofort getroffen werden. Im Warten liegt Weisheit.'
        }
      }
    ]
  },

  {
    id: 'die-anderen',
    title: 'Die Anderen',
    description: 'Du triffst auf eine Gruppe Menschen. Sie sind laut, chaotisch, voller Energie. Du könntest dich anschließen – oder deinen eigenen Weg gehen.',
    longDescription: 'Sie winken dir zu, lachen und rufen: "Komm zu uns! Zusammen sind wir stärker!" Aber eine leise Stimme in dir sagt: "Du bist auch alleine stark."',
    theme: 'Gemeinschaft & Individuum',
    npcName: 'Die Gruppe',
    npcAvatar: '👥',
    choices: [
      {
        id: 'anschliessen',
        text: 'Dich der Gruppe anschließen',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 30,
          description: 'In Gemeinschaft liegt Kraft. Du öffnest dein Herz für andere.'
        }
      },
      {
        id: 'alleine-bleiben',
        text: 'Alleine weitergehen',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 30,
          description: 'Du erkennst, dass wahre Stärke auch in der Einsamkeit wachsen kann.'
        }
      },
      {
        id: 'bruecke-bauen',
        text: 'Eine Brücke bauen: Verbunden, aber autonom',
        effects: {
          stat: 'weisheit',
          value: 3,
          xp: 45,
          description: 'Die Kunst ist es, mit anderen verbunden zu sein, ohne sich selbst zu verlieren.'
        }
      },
      {
        id: 'anderen-helfen',
        text: 'Der Gruppe helfen, dann weiterziehen',
        effects: {
          stat: 'liebe',
          value: 1,
          xp: 25,
          description: 'Du gibst, was du kannst, und gehst dann deinen Weg. Liebe ohne Anhaftung.'
        }
      }
    ]
  },

  {
    id: 'angst-begegnen',
    title: 'Der Angst begegnen',
    description: 'Eine Gestalt aus deinen tiefsten Ängsten materialisiert sich vor dir. Sie ist riesig, dunkel, überwältigend.',
    longDescription: 'Die Angst spricht: "Ich bin alles, was du fürchtest. Ich bin deine Schwäche, dein Versagen, deine Dunkelheit." Was tust du?',
    theme: 'Angst & Mut',
    npcName: 'Deine größte Angst',
    npcAvatar: '👤',
    choices: [
      {
        id: 'kaempfen',
        text: 'Gegen die Angst kämpfen',
        effects: {
          stat: 'mut',
          value: 1,
          xp: 20,
          description: 'Du stellst dich deiner Angst im Kampf. Mut bedeutet nicht, keine Angst zu haben, sondern trotz Angst zu handeln.'
        }
      },
      {
        id: 'akzeptieren',
        text: 'Die Angst akzeptieren und umarmen',
        effects: {
          stat: 'weisheit',
          value: 3,
          xp: 50,
          description: 'Du erkennst: Angst ist ein Teil von dir. Wenn du sie annimmst, verliert sie ihre Macht.'
        }
      },
      {
        id: 'durchschauen',
        text: 'Erkennen, dass die Angst nur eine Illusion ist',
        effects: {
          stat: 'bewusstsein',
          value: 3,
          xp: 45,
          description: 'In dem Moment, in dem du erkennst, dass Angst nur Gedanken sind, verschwindet ihre Kontrolle.'
        }
      },
      {
        id: 'mit-angst-reden',
        text: 'Mit der Angst sprechen: "Was willst du mir zeigen?"',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 35,
          description: 'Jede Angst trägt eine Botschaft. Wenn du zuhörst, wird sie zum Lehrer.'
        }
      }
    ]
  },

  {
    id: 'time-paradox',
    title: 'Das Zeitparadoxon',
    description: 'Du triffst dein zukünftiges Ich. Es sieht müde aus, aber weise. "Ich komme aus deiner Zukunft", sagt es.',
    longDescription: '"Höre mir zu", sagt dein zukünftiges Ich, "ich kann dir sagen, welche Entscheidungen richtig sind. Ich habe alle Fehler schon gemacht." Aber ist das der richtige Weg?',
    theme: 'Zeit & Entscheidung',
    npcName: 'Dein zukünftiges Ich',
    npcAvatar: '⏳',
    choices: [
      {
        id: 'zuhoeren',
        text: 'Zuhören und den Rat befolgen',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 30,
          description: 'Von der Weisheit der Zukunft zu lernen, kann Leid ersparen.'
        }
      },
      {
        id: 'eigene-fehler',
        text: 'Ablehnen - "Ich muss meine eigenen Fehler machen"',
        effects: {
          stat: 'mut',
          value: 3,
          xp: 45,
          description: 'Wahres Wachstum kommt durch eigene Erfahrung, nicht durch vermiedene Fehler.'
        }
      },
      {
        id: 'fragen-stellen',
        text: 'Fragen stellen: "Warum bist du wirklich hier?"',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 35,
          description: 'Die wichtigsten Antworten liegen oft hinter der ersten Frage.'
        }
      },
      {
        id: 'zeit-akzeptieren',
        text: 'Erkennen: Vergangenheit, Gegenwart, Zukunft sind eins',
        effects: {
          stat: 'bewusstsein',
          value: 4,
          xp: 60,
          description: 'Zeit ist eine Illusion. Alles geschieht im ewigen Jetzt.'
        }
      }
    ]
  }
]

// Helper function to get random quest
export function getRandomQuest(): Quest {
  return philosophicalQuests[Math.floor(Math.random() * philosophicalQuests.length)]
}

// Helper function to get quest by theme
export function getQuestsByTheme(theme: string): Quest[] {
  return philosophicalQuests.filter(q => q.theme.toLowerCase().includes(theme.toLowerCase()))
}
