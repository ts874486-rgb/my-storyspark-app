import type { ThemeId } from '@/types';

export interface SamplePage {
  text: (name: string, age: number) => string;
}

function page(text: (name: string, age: number) => string): SamplePage {
  return { text };
}

export const SAMPLE_STORY_PAGES: Record<ThemeId, SamplePage[]> = {
  space: [
    page((name, age) => `${name}, a brave ${age}-year-old astronaut, climbed into a shiny silver rocket. The engines hummed a sleepy little tune as the stars welcomed them.`),
    page((name) => `Their first stop was a ringed planet where the rocks sang like wind chimes. ${name} collected one shiny pebble to bring home.`),
    page((name) => `A friendly alien with three glowing antennae waved hello. "I lost my comet," it said. ${name} smiled, "Let's find it together!"`),
    page((name) => `Together they zoomed through a field of sparkling asteroids, following a trail of stardust that twinkled like tiny nightlights.`),
    page((name) => `They found the comet nestled inside a crystal cave on a tiny moon. It glowed purple and hummed happily when ${name} gently picked it up.`),
    page((name) => `The alien friend invited ${name} to a picnic on a planet made of soft marshmallow hills. They ate star-shaped sandwiches and giggled.`),
    page((name) => `${name} found a magic space brush and painted a rainbow across a grey planet. It bloomed with flowers and the rocks turned into candy.`),
    page((name) => `They slid down the comet's tail like a playground slide, leaving trails of sparkles behind. ${name} laughed all the way down.`),
    page((name) => `It was time to go home. ${name} hugged the alien friend and waved goodbye as the rocket turned around, heading back toward Earth.`),
    page((name) => `Snuggled in the cozy seat, ${name} dreamed of the next adventure. The stars sang a lullaby, and the rocket drifted gently home. Goodnight, brave explorer.`),
  ],
  dino: [
    page((name, age) => `Deep in a valley of giant ferns, ${name}, a ${age}-year-old explorer, found a friendly dinosaur hiding behind a waterfall. It had been waiting all morning for a brave visitor.`),
    page((name) => `The gentle giant lowered its long neck and offered ${name} a ride across the river. Together they splashed through rainbow mist and waved at the flying birds.`),
    page((name) => `On the far hill they found a nest of tiny eggs that needed a warm place to rest. ${name} gently helped carry them to a soft bed of leaves.`),
    page((name) => `A baby dinosaur hatched and wanted to play! ${name} and the baby played hide-and-seek behind the giant ferns until they were both out of breath.`),
    page((name) => `They rode past a friendly volcano that puffed gentle smoke rings. ${name} popped each ring like a bubble and the dinosaur cheered.`),
    page((name) => `${name} set up a tiny tea party under a giant prehistoric tree. The dinosaurs tried to drink from the small cups and everyone laughed.`),
    page((name) => `As the sun dipped low, fireflies lit up the meadow. ${name} and the dinosaur friends watched them dance like tiny floating stars.`),
    page((name) => `${name} discovered a special flower that glowed in the dark. "For you," whispered the gentle dinosaur, nudging it forward with its nose.`),
    page((name) => `The stars began to appear. ${name} hugged each dinosaur friend goodnight. The baby dinosaur gave a tiny sleepy roar.`),
    page((name) => `${name} drifted off to sleep under a blanket of stars, the baby dinosaur curled up close by. The valley hummed a lullaby. Goodnight, little explorer.`),
  ],
  forest: [
    page((name, age) => `Where the trees whisper secrets, ${name}, who was ${age} years old, stepped onto a moss-covered path. A tiny golden glow was tucked between the leaves, waiting for them.`),
    page((name) => `The glow belonged to a fairy named Pip, who had lost her wand somewhere beneath the mushrooms. ${name} promised to help her search every corner of the woods.`),
    page((name) => `Blue butterflies led the way past singing streams and over a bridge made of twisted vines. With ${name} beside her, Pip's light grew brighter with every step.`),
    page((name) => `They entered a grove of glowing mushrooms that hummed a soft melody. ${name} noticed a sparkle tucked under the biggest mushroom.`),
    page((name) => `The wand sparkled in a patch of golden sunlight! Pip was so happy she did a little spin and sprinkled star dust all around.`),
    page((name) => `Pip's friend, a wise old owl, offered them a ride over the treetops. ${name} held on tight as the wind tickled their face.`),
    page((name) => `They landed in a clearing full of flowers where the fairies were having tea. ${name} was given a cup of dewdrop tea and a petal cookie.`),
    page((name) => `${name} helped Pip decorate the oldest tree with glowing star ornaments until it shone like a Christmas tree in the middle of the forest.`),
    page((name) => `The trees began to hum a goodnight song. ${name} hugged Pip tightly. "Come back anytime," the fairy whispered, tucking a star into ${name}'s pocket.`),
    page((name) => `The forest grew quiet and the fireflies dimmed their lights. ${name} dreamed of fairies and glowing mushrooms. Goodnight, kind friend.`),
  ],
  jungle: [
    page((name, age) => `Deep in the green rainforest, ${name}, a ${age}-year-old safari explorer, heard a friendly roar and followed a path lined with glowing flowers.`),
    page((name) => `A gentle lion with a golden mane invited ${name} to climb on its back. Together they walked across the savanna while the tall grass swayed in the breeze.`),
    page((name) => `Playful monkeys swung from branch to branch, showing ${name} the way to a hidden waterfall where rainbows danced on the water.`),
    page((name) => `${name} splashed in the cool water while the monkeys chattered happily. The rainbow mist made everything feel magical.`),
    page((name) => `The lion brought juicy mangoes and the monkeys brought bananas. ${name} shared a fruit picnic with all the jungle friends on a soft mossy bank.`),
    page((name) => `A parade of colorful butterflies fluttered by. ${name} and all the animal friends watched in wonder as they painted the sky with colors.`),
    page((name) => `${name} found a baby elephant who had lost its way. Holding the lion's mane for courage, ${name} guided the little elephant safely across the stream.`),
    page((name) => `They all climbed a gentle hill to watch the sunset. The sky turned orange and pink, and the lion rumbled a happy, sleepy purr.`),
    page((name) => `As the stars came out, ${name} waved goodbye to each friend. The monkeys hugged, the elephant trumpeted softly, and the lion nuzzled close.`),
    page((name) => `${name} curled up in a cozy hammock, fireflies glowing softly nearby. The jungle hummed a goodnight song. Goodnight, brave safari friend.`),
  ],
};

export const SAMPLE_STORY_TITLES: Record<ThemeId, string> = {
  space: 'The Little Star Explorer',
  dino: 'The Valley of Gentle Giants',
  forest: 'The Fairy of the Whispering Woods',
  jungle: 'The Jungle Friendship Safari',
};
