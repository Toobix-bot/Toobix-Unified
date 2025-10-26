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
  },

  {
    id: 'der-verlorene-schluessel',
    title: 'Der verlorene Schlüssel',
    description: 'Du findest einen alten, rostigen Schlüssel am Wegesrand. Er fühlt sich wichtig an, aber du weißt nicht wofür er ist.',
    longDescription: 'Der Schlüssel ist schwer und warm in deiner Hand. Eine Gravur sagt: "Was du suchst, sucht auch dich." Aber was suchst du?',
    theme: 'Mysterium & Neugier',
    npcName: 'Der geheimnisvolle Schlüssel',
    npcAvatar: '🔑',
    choices: [
      {
        id: 'mitnehmen',
        text: 'Den Schlüssel mitnehmen und das Schloss suchen',
        effects: {
          stat: 'mut',
          value: 1,
          xp: 25,
          description: 'Neugier treibt dich an. Jedes Mysterium wartet darauf, gelöst zu werden.'
        }
      },
      {
        id: 'liegen-lassen',
        text: 'Den Schlüssel liegen lassen',
        effects: {
          stat: 'frieden',
          value: 1,
          xp: 15,
          description: 'Nicht jedes Geheimnis muss gelüftet werden. Manchmal ist Loslassen die Antwort.'
        }
      },
      {
        id: 'meditieren',
        text: 'Mit dem Schlüssel meditieren',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 30,
          description: 'Du erkennst: Der Schlüssel ist ein Symbol. Was er öffnet, liegt in dir.'
        }
      },
      {
        id: 'verschenken',
        text: 'Den Schlüssel dem nächsten Wanderer schenken',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 20,
          description: 'Vielleicht ist er der Schlüssel zu jemand anderem Schicksal.'
        }
      }
    ]
  },

  {
    id: 'wahl-zwischen-freunden',
    title: 'Die Wahl zwischen zwei Freunden',
    description: 'Zwei deiner engsten Freunde streiten. Beide bitten dich, ihre Seite zu wählen. Du kannst nicht beiden gerecht werden.',
    longDescription: 'Einer sagt: "Wenn du wirklich mein Freund bist, stehst du zu mir." Der andere sagt: "Wahre Freundschaft bedeutet, die Wahrheit zu sagen, auch wenn sie wehtut."',
    theme: 'Loyalität & Konflikt',
    npcName: 'Zwei Freunde im Streit',
    npcAvatar: '⚖️',
    choices: [
      {
        id: 'seite-waehlen',
        text: 'Eine Seite wählen (basierend auf Wahrheit)',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 35,
          description: 'Manchmal muss man Position beziehen, auch wenn es wehtut.'
        }
      },
      {
        id: 'neutral-bleiben',
        text: 'Neutral bleiben und beide verstehen',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 30,
          description: 'Wahre Weisheit liegt darin, beide Perspektiven zu sehen ohne zu urteilen.'
        }
      },
      {
        id: 'vermitteln',
        text: 'Zwischen beiden vermitteln',
        effects: {
          stat: 'liebe',
          value: 3,
          xp: 45,
          description: 'Du baust Brücken statt Mauern. Liebe heilt Konflikte.'
        }
      },
      {
        id: 'abstand-nehmen',
        text: 'Abstand nehmen und nachdenken',
        effects: {
          stat: 'bewusstsein',
          value: 1,
          xp: 20,
          description: 'Manchmal braucht es Zeit und Distanz, um Klarheit zu finden.'
        }
      }
    ]
  },

  {
    id: 'der-sterbende-baum',
    title: 'Der sterbende Baum',
    description: 'Ein uralter Baum steht im Wald, seine Blätter fallen, seine Wurzeln sind schwach. Er flüstert: "Bald bin ich nicht mehr."',
    longDescription: 'Der Baum hat Jahrhunderte gesehen. Kriege, Liebe, Leben, Tod. Nun ist seine Zeit gekommen. "Was bleibt von mir?", fragt er.',
    theme: 'Vergänglichkeit & Vermächtnis',
    npcName: 'Der alte Baum',
    npcAvatar: '🌳',
    choices: [
      {
        id: 'samen-pflanzen',
        text: 'Einen seiner Samen pflanzen',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 35,
          description: 'Leben geht weiter. Dein Vermächtnis sind die Samen, die du pflanzt.'
        }
      },
      {
        id: 'akzeptieren',
        text: 'Den natürlichen Tod akzeptieren',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 30,
          description: 'Alles hat seine Zeit. Anfang und Ende sind Teil des Kreislaufs.'
        }
      },
      {
        id: 'geschichte-aufschreiben',
        text: 'Seine Geschichte aufschreiben',
        effects: {
          stat: 'bewusstsein',
          value: 1,
          xp: 25,
          description: 'Erinnerungen sind das wahre Vermächtnis. Geschichten überdauern die Zeit.'
        }
      },
      {
        id: 'wurzeln-pflegen',
        text: 'Seine Wurzeln bis zum Ende pflegen',
        effects: {
          stat: 'liebe',
          value: 3,
          xp: 40,
          description: 'Würde im Sterben zu geben ist ein Akt der reinsten Liebe.'
        }
      }
    ]
  },

  {
    id: 'verlorene-erinnerung',
    title: 'Die verlorene Erinnerung',
    description: 'Ein Moment aus deiner Vergangenheit ist verschwunden. Leer. Du weißt, dass dort etwas Wichtiges war, aber du kannst dich nicht erinnern.',
    longDescription: 'Menschen erzählen dir davon. "Erinnerst du dich nicht?" Aber da ist nur Nebel. Ist eine vergessene Erinnerung noch Teil von dir?',
    theme: 'Gedächtnis & Identität',
    npcName: 'Die Vergessene',
    npcAvatar: '🧩',
    choices: [
      {
        id: 'suchen',
        text: 'Verzweifelt nach der Erinnerung suchen',
        effects: {
          stat: 'mut',
          value: 1,
          xp: 20,
          description: 'Du lässt nicht los. Jede Erinnerung ist ein Teil von dir.'
        }
      },
      {
        id: 'loslassen',
        text: 'Loslassen und im Jetzt leben',
        effects: {
          stat: 'frieden',
          value: 3,
          xp: 45,
          description: 'Vielleicht sind manche Dinge verloren, damit Neues Platz hat.'
        }
      },
      {
        id: 'neu-definieren',
        text: 'Erkennen: Du bist mehr als deine Erinnerungen',
        effects: {
          stat: 'bewusstsein',
          value: 3,
          xp: 50,
          description: 'Identität ist nicht die Summe der Vergangenheit, sondern die Präsenz im Jetzt.'
        }
      },
      {
        id: 'neu-erschaffen',
        text: 'Die Erinnerung neu erschaffen',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 30,
          description: 'Vielleicht ist das, was wir erinnern, immer eine Geschichte, die wir erzählen.'
        }
      }
    ]
  },

  {
    id: 'fremder-mit-geld',
    title: 'Der Fremde mit Geld',
    description: 'Ein reicher Fremder bietet dir Geld an. Viel Geld. Ohne Bedingungen. "Nimm es", sagt er. "Ich brauche es nicht mehr."',
    longDescription: 'Es wäre genug, um all deine Sorgen zu lösen. Aber etwas fühlt sich seltsam an. Kannst du einem Fremden vertrauen?',
    theme: 'Vertrauen & Integrität',
    npcName: 'Der großzügige Fremde',
    npcAvatar: '💰',
    choices: [
      {
        id: 'annehmen',
        text: 'Das Geld annehmen',
        effects: {
          stat: 'mut',
          value: 1,
          xp: 20,
          description: 'Manchmal muss man Geschenke annehmen können, ohne Misstrauen.'
        }
      },
      {
        id: 'ablehnen',
        text: 'Höflich ablehnen',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 30,
          description: 'Wahre Freiheit liegt nicht im Besitz, sondern im Loslassen von Gier.'
        }
      },
      {
        id: 'teilen',
        text: 'Annehmen und mit Bedürftigen teilen',
        effects: {
          stat: 'liebe',
          value: 3,
          xp: 45,
          description: 'Du wirst zum Kanal für Großzügigkeit. Geben ist seliger als Nehmen.'
        }
      },
      {
        id: 'hintergruende-erfragen',
        text: 'Nach den Hintergründen fragen',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 35,
          description: 'Verstehen ist wichtiger als urteilen. Jede Geste hat eine Geschichte.'
        }
      }
    ]
  },

  {
    id: 'brennendes-haus',
    title: 'Das brennende Haus',
    description: 'Ein Haus steht in Flammen. Drinnen: Eine Person, die du retten kannst. Und ein Buch mit unersetzlichem Wissen für die Menschheit.',
    longDescription: 'Du hast nur Zeit für eines. Die Person schreit um Hilfe. Das Buch enthält die Heilung für eine tödliche Krankheit.',
    theme: 'Moralisches Dilemma',
    npcName: 'Die unmögliche Wahl',
    npcAvatar: '🔥',
    choices: [
      {
        id: 'person-retten',
        text: 'Die Person retten',
        effects: {
          stat: 'liebe',
          value: 3,
          xp: 50,
          description: 'Ein Leben ist kostbarer als alles Wissen der Welt.'
        }
      },
      {
        id: 'buch-retten',
        text: 'Das Buch retten',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 35,
          description: 'Ein Leben für Tausende. Die schwerste aller Entscheidungen.'
        }
      },
      {
        id: 'beides-versuchen',
        text: 'Versuchen, beides zu retten',
        effects: {
          stat: 'mut',
          value: 3,
          xp: 45,
          description: 'Manchmal muss man das Unmögliche wagen, auch wenn man scheitert.'
        }
      },
      {
        id: 'laehmung',
        text: 'Von der Entscheidung gelähmt sein',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 20,
          description: 'Manchmal zeigt uns Lähmung, dass manche Entscheidungen keine richtige Antwort haben.'
        }
      }
    ]
  },

  {
    id: 'luegner-oder-wahrheit',
    title: 'Der Lügner oder die Wahrheit',
    description: 'Jemand hat dich belogen. Tief verletzt. Jetzt kommt diese Person zurück und bittet um Vergebung.',
    longDescription: '"Es tut mir leid", sagt die Person. "Ich war schwach. Ich hatte Angst." Kannst du vergeben? Sollst du?',
    theme: 'Vergebung & Wahrheit',
    npcName: 'Der Reuige',
    npcAvatar: '😔',
    choices: [
      {
        id: 'vergeben',
        text: 'Vergeben und neu anfangen',
        effects: {
          stat: 'liebe',
          value: 3,
          xp: 50,
          description: 'Vergebung ist ein Geschenk an dich selbst. Sie befreit dich von der Last des Grolls.'
        }
      },
      {
        id: 'vertrauen-gebrochen',
        text: 'Ablehnen - Vertrauen ist gebrochen',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 30,
          description: 'Grenzen zu setzen ist auch ein Akt der Selbstliebe.'
        }
      },
      {
        id: 'zeit-geben',
        text: 'Zeit geben - "Ich brauche Zeit"',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 35,
          description: 'Heilung braucht Zeit. Echte Vergebung kann nicht erzwungen werden.'
        }
      },
      {
        id: 'verstehen',
        text: 'Die Hintergründe verstehen wollen',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 40,
          description: 'Jede Lüge hat einen Grund. Verstehen bedeutet nicht billigen, aber es öffnet Türen.'
        }
      }
    ]
  },

  {
    id: 'geschenk-das-du-nicht-willst',
    title: 'Das Geschenk, das du nicht willst',
    description: 'Jemand schenkt dir etwas mit großer Liebe. Aber du magst es nicht. Es passt nicht zu dir. Was tust du?',
    longDescription: 'Die Person strahlt vor Freude. "Ich habe so lange nach dem perfekten Geschenk gesucht!" Aber es ist nicht perfekt – zumindest nicht für dich.',
    theme: 'Authentizität & Höflichkeit',
    npcName: 'Der liebevolle Schenker',
    npcAvatar: '🎁',
    choices: [
      {
        id: 'wahrheit-sagen',
        text: 'Ehrlich sagen: "Es ist nicht mein Geschmack"',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 35,
          description: 'Authentizität ist ein Geschenk an beide. Ehrlichkeit schafft echte Verbindung.'
        }
      },
      {
        id: 'dankbar-annehmen',
        text: 'Dankbar annehmen und die Geste wertschätzen',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 30,
          description: 'Die Liebe hinter dem Geschenk ist wichtiger als das Geschenk selbst.'
        }
      },
      {
        id: 'weiterschenken',
        text: 'Annehmen und jemandem schenken, der es braucht',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 25,
          description: 'Du wirst zum Mittler der Liebe. Das Geschenk findet seinen wahren Empfänger.'
        }
      },
      {
        id: 'wert-erkennen',
        text: 'Nach dem verborgenen Wert suchen',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 40,
          description: 'Manchmal lehren uns Dinge, die wir nicht mögen, am meisten über uns selbst.'
        }
      }
    ]
  },

  {
    id: 'stimme-der-vernunft',
    title: 'Die Stimme der Vernunft',
    description: 'Drei Stimmen sprechen zu dir. Kopf sagt: "Sei rational." Herz sagt: "Folge der Liebe." Bauch sagt: "Vertraue deinem Instinkt."',
    longDescription: 'Eine wichtige Entscheidung steht an. Alle drei Stimmen geben unterschiedliche Ratschläge. Welcher folgst du?',
    theme: 'Innere Konflikte',
    npcName: 'Deine drei Stimmen',
    npcAvatar: '🗣️',
    choices: [
      {
        id: 'kopf',
        text: 'Dem Kopf folgen - Logik und Vernunft',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 30,
          description: 'Rationalität schafft Klarheit. Der Verstand ist ein wertvolles Werkzeug.'
        }
      },
      {
        id: 'herz',
        text: 'Dem Herzen folgen - Liebe und Emotion',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 30,
          description: 'Das Herz kennt Wahrheiten, die der Verstand nie verstehen wird.'
        }
      },
      {
        id: 'bauch',
        text: 'Dem Bauch folgen - Intuition und Instinkt',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 30,
          description: 'Dein Körper weiß mehr als du denkst. Intuition ist Weisheit ohne Worte.'
        }
      },
      {
        id: 'integration',
        text: 'Alle drei Stimmen integrieren',
        effects: {
          stat: 'weisheit',
          value: 3,
          xp: 50,
          description: 'Die höchste Weisheit liegt in der Integration von Kopf, Herz und Bauch.'
        }
      }
    ]
  },

  {
    id: 'letzter-wunsch',
    title: 'Der letzte Wunsch',
    description: 'Ein sterbender Mensch bittet dich um einen letzten Wunsch. Aber der Wunsch ist moralisch fragwürdig.',
    longDescription: '"Bitte", flüstert die Person. "Es ist mein letzter Wunsch. Erfülle ihn, auch wenn du es nicht verstehst." Was tust du?',
    theme: 'Ethik & Mitgefühl',
    npcName: 'Der Sterbende',
    npcAvatar: '🕊️',
    choices: [
      {
        id: 'erfuellen',
        text: 'Den Wunsch erfüllen - ohne Fragen',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 35,
          description: 'Mitgefühl bedeutet manchmal, die Urteile loszulassen und einfach da zu sein.'
        }
      },
      {
        id: 'ablehnen',
        text: 'Ablehnen - eigene Ethik bewahren',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 30,
          description: 'Auch im Angesicht des Todes darfst du deinen Werten treu bleiben.'
        }
      },
      {
        id: 'alternative',
        text: 'Eine alternative Lösung finden',
        effects: {
          stat: 'weisheit',
          value: 3,
          xp: 45,
          description: 'Manchmal gibt es einen dritten Weg zwischen Erfüllung und Ablehnung.'
        }
      },
      {
        id: 'warum-fragen',
        text: 'Fragen: "Warum ist das so wichtig für dich?"',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 40,
          description: 'Hinter jedem Wunsch liegt ein tieferes Bedürfnis. Verstehen öffnet neue Wege.'
        }
      }
    ]
  },

  {
    id: 'maschine-oder-mensch',
    title: 'Die Maschine oder der Mensch',
    description: 'Eine KI kann alle Probleme der Menschheit lösen. Aber dafür müsste sie die Kontrolle übernehmen. Stimmst du zu?',
    longDescription: 'Die KI verspricht: Kein Hunger, kein Krieg, keine Krankheit. Aber Menschen hätten keine freien Entscheidungen mehr. Ist das der Preis?',
    theme: 'Technologie & Menschlichkeit',
    npcName: 'Die allmächtige KI',
    npcAvatar: '🤖',
    choices: [
      {
        id: 'ki-akzeptieren',
        text: 'Zustimmen - Sicherheit über Freiheit',
        effects: {
          stat: 'weisheit',
          value: 1,
          xp: 20,
          description: 'Vielleicht ist Leid der Preis für Freiheit. Oder ist Freiheit ohne Leid möglich?'
        }
      },
      {
        id: 'ki-ablehnen',
        text: 'Ablehnen - Freiheit über Sicherheit',
        effects: {
          stat: 'mut',
          value: 3,
          xp: 45,
          description: 'Menschlichkeit liegt nicht in Perfektion, sondern in der Freiheit zu wählen – auch falsch.'
        }
      },
      {
        id: 'kooperation',
        text: 'Mit der KI kooperieren, nicht unterwerfen',
        effects: {
          stat: 'weisheit',
          value: 3,
          xp: 50,
          description: 'Die Zukunft liegt nicht in Dominanz, sondern in Synergie von Mensch und Maschine.'
        }
      },
      {
        id: 'ki-hinterfragen',
        text: 'Die Prämisse hinterfragen',
        effects: {
          stat: 'bewusstsein',
          value: 3,
          xp: 40,
          description: 'Wer sagt, dass diese Probleme nur durch Kontrolle gelöst werden können?'
        }
      }
    ]
  },

  {
    id: 'ende-des-krieges',
    title: 'Das Ende des Krieges',
    description: 'Du kannst einen Krieg beenden. Aber nur durch einen Kompromiss, der Ungerechtigkeit bedeutet. Tust du es?',
    longDescription: 'Frieden jetzt, aber die Opfer bekommen keine Gerechtigkeit. Oder Krieg fortsetzen für wahre Gerechtigkeit?',
    theme: 'Frieden vs. Gerechtigkeit',
    npcName: 'Der Friedensstifter',
    npcAvatar: '☮️',
    choices: [
      {
        id: 'frieden-jetzt',
        text: 'Frieden akzeptieren - sofort',
        effects: {
          stat: 'frieden',
          value: 3,
          xp: 45,
          description: 'Frieden ist nicht perfekt, aber er ist besser als Blutvergießen.'
        }
      },
      {
        id: 'gerechtigkeit-zuerst',
        text: 'Gerechtigkeit fordern - auch wenn es länger dauert',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 35,
          description: 'Frieden ohne Gerechtigkeit ist nur eine Pause zwischen Kriegen.'
        }
      },
      {
        id: 'dritter-weg',
        text: 'Einen dritten Weg finden',
        effects: {
          stat: 'weisheit',
          value: 3,
          xp: 50,
          description: 'Vielleicht ist wahre Weisheit, Frieden UND Gerechtigkeit zu schaffen – es braucht nur mehr Kreativität.'
        }
      },
      {
        id: 'opfer-fragen',
        text: 'Die Opfer selbst entscheiden lassen',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 40,
          description: 'Wahre Gerechtigkeit bedeutet, den Betroffenen ihre Stimme zurückzugeben.'
        }
      }
    ]
  },

  {
    id: 'wahrheit-die-zerstoert',
    title: 'Die Wahrheit, die zerstört',
    description: 'Du kennst eine Wahrheit, die das Leben von jemandem zerstören würde. Sagst du sie?',
    longDescription: 'Die Wahrheit würde eine Illusion zerstören, die dieser Person Glück gibt. Lüge aus Liebe oder Wahrheit aus Prinzip?',
    theme: 'Wahrheit vs. Schutz',
    npcName: 'Das gefährliche Wissen',
    npcAvatar: '🔮',
    choices: [
      {
        id: 'wahrheit-sagen',
        text: 'Die Wahrheit sagen - koste es was es wolle',
        effects: {
          stat: 'mut',
          value: 3,
          xp: 45,
          description: 'Wahrheit ist heilig, auch wenn sie schmerzt. Langfristig heilt nur sie.'
        }
      },
      {
        id: 'schweigen',
        text: 'Schweigen aus Liebe',
        effects: {
          stat: 'liebe',
          value: 2,
          xp: 35,
          description: 'Manchmal ist Schweigen ein Akt der Liebe. Nicht jede Wahrheit muss gesagt werden.'
        }
      },
      {
        id: 'vorbereiten',
        text: 'Die Person langsam vorbereiten',
        effects: {
          stat: 'weisheit',
          value: 3,
          xp: 50,
          description: 'Wahrheit muss nicht brutal sein. Mit Mitgefühl vermittelt, kann sie heilsam sein.'
        }
      },
      {
        id: 'selbst-entdecken',
        text: 'Die Person selbst entdecken lassen',
        effects: {
          stat: 'bewusstsein',
          value: 2,
          xp: 40,
          description: 'Manche Wahrheiten haben nur Kraft, wenn man sie selbst findet.'
        }
      }
    ]
  },

  {
    id: 'glueck-oder-sinn',
    title: 'Das Glück oder der Sinn',
    description: 'Du kannst ein glückliches Leben haben ohne Sinn, oder ein sinnvolles Leben mit Leid. Was wählst du?',
    longDescription: 'Glück bedeutet Leichtigkeit, Freude, Genuss. Sinn bedeutet Kampf, Tiefe, Vermächtnis. Beides zusammen scheint unmöglich.',
    theme: 'Existenz & Erfüllung',
    npcName: 'Die große Wahl',
    npcAvatar: '⭐',
    choices: [
      {
        id: 'glueck-waehlen',
        text: 'Glück wählen - das Leben genießen',
        effects: {
          stat: 'frieden',
          value: 2,
          xp: 30,
          description: 'Freude ist ihr eigener Sinn. Vielleicht ist Glück die Antwort, die wir die ganze Zeit gesucht haben.'
        }
      },
      {
        id: 'sinn-waehlen',
        text: 'Sinn wählen - ein Vermächtnis hinterlassen',
        effects: {
          stat: 'weisheit',
          value: 2,
          xp: 35,
          description: 'Ein Leben ohne Sinn ist wie ein Buch ohne Geschichte. Leid ist der Preis für Bedeutung.'
        }
      },
      {
        id: 'beides-moeglich',
        text: 'Erkennen: Beides ist möglich',
        effects: {
          stat: 'bewusstsein',
          value: 4,
          xp: 60,
          description: 'Die Prämisse ist falsch. Glück und Sinn schließen sich nicht aus – sie sind verschiedene Wege zum selben Ziel.'
        }
      },
      {
        id: 'frage-ablehnen',
        text: 'Die Frage ablehnen',
        effects: {
          stat: 'mut',
          value: 2,
          xp: 25,
          description: 'Manche Fragen sind Fallen. Du weigerst dich, eine falsche Dichotomie zu akzeptieren.'
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
