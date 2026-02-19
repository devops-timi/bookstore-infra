// ================================================================
//  FOLIO BOOKSTORE — BOOKS DATA
//  Mirrors the structure returned by GET /api/books
// ================================================================

const BOOKS = [
  // ── NYT BESTSELLERS ──────────────────────────────────────────
  {
    id: 1,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    category: "nyt",
    categoryLabel: "NYT Bestseller",
    price: 18.99,
    year: 2022,
    stock: 14,
    description:
      "A sweeping novel about creativity, identity, love, and the redemptive powers of play — told through the friendship of two video-game designers from college through middle age.",
    color: "#6b7a4a",
  },
  {
    id: 2,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    category: "nyt",
    categoryLabel: "NYT Bestseller",
    price: 22.99,
    year: 2023,
    stock: 9,
    description:
      "Twenty-three-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant, leading a quiet life. But her mother has other plans — and those plans involve dragons.",
    color: "#7a3a3a",
  },
  {
    id: 3,
    title: "Intermezzo",
    author: "Sally Rooney",
    category: "nyt",
    categoryLabel: "NYT Bestseller",
    price: 20.00,
    year: 2024,
    stock: 21,
    description:
      "Two brothers grieve their father's death while navigating wildly different love affairs. Rooney at her most mature and expansive.",
    color: "#3a4a6b",
  },

  // ── CLASSICS ─────────────────────────────────────────────────
  {
    id: 4,
    title: "Middlemarch",
    author: "George Eliot",
    category: "classics",
    categoryLabel: "Classic",
    price: 12.99,
    year: 1871,
    stock: 33,
    description:
      "Set in the fictitious English Midlands town of Middlemarch, this grand novel traces the lives and loves of a cast of provincial characters — and is widely regarded as one of the greatest novels in the English language.",
    color: "#5a4a2a",
  },
  {
    id: 5,
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    category: "classics",
    categoryLabel: "Classic",
    price: 11.99,
    year: 1878,
    stock: 28,
    description:
      "A masterpiece of realistic fiction, exploring themes of love, jealousy, faith, and social class in 19th-century Russia through the tragic story of Anna Karenina.",
    color: "#4a2a2a",
  },
  {
    id: 6,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "classics",
    categoryLabel: "Classic",
    price: 13.50,
    year: 1960,
    stock: 41,
    description:
      "Through the eyes of young Scout Finch, this Pulitzer Prize winner explores racial injustice and moral growth in the American South — a profound meditation on human dignity.",
    color: "#3a5a3a",
  },

  // ── CHILDREN'S BOOKS ─────────────────────────────────────────
  {
    id: 7,
    title: "The Phantom Tollbooth",
    author: "Norton Juster",
    category: "children",
    categoryLabel: "Children's Book",
    price: 10.99,
    year: 1961,
    stock: 17,
    description:
      "Milo, bored with everything, drives through a magical tollbooth and discovers the Lands Beyond — a witty, intelligent adventure through puns and logic puzzles.",
    color: "#7a5a2a",
  },
  {
    id: 8,
    title: "Where the Wild Things Are",
    author: "Maurice Sendak",
    category: "children",
    categoryLabel: "Children's Book",
    price: 9.99,
    year: 1963,
    stock: 52,
    description:
      "Max dons a wolf suit, makes mischief, and sails to the land of wild things in this timeless picture book about imagination, emotion, and the love that tames even the wildest heart.",
    color: "#3a5a6b",
  },

  // ── TOP 9 ─────────────────────────────────────────────────────
  {
    id: 9,
    title: "Demon Copperhead",
    author: "Barbara Kingsolver",
    category: "top9",
    categoryLabel: "Top 9",
    price: 19.99,
    year: 2022,
    stock: 11,
    description:
      "A Pulitzer Prize-winning retelling of David Copperfield set in the Appalachian opioid crisis, following a boy born into poverty who navigates a world stacked against him.",
    color: "#6b3a4a",
  },
  {
    id: 10,
    title: "Lessons in Chemistry",
    author: "Bonnie Garmus",
    category: "top9",
    categoryLabel: "Top 9",
    price: 17.99,
    year: 2022,
    stock: 8,
    description:
      "A chemist-turned-cooking-show host in 1960s California inspires a generation of women to think for themselves in this wickedly funny, heartfelt debut novel.",
    color: "#4a6b3a",
  },
  {
    id: 11,
    title: "The Covenant of Water",
    author: "Abraham Verghese",
    category: "top9",
    categoryLabel: "Top 9",
    price: 21.50,
    year: 2023,
    stock: 6,
    description:
      "An epic spanning three generations of a family in South India, tracing how a mysterious illness connects them to the land, to each other, and to history itself.",
    color: "#2a4a6b",
  },

  // ── SOCIAL JUSTICE ───────────────────────────────────────────
  {
    id: 12,
    title: "The New Jim Crow",
    author: "Michelle Alexander",
    category: "social",
    categoryLabel: "Social Justice",
    price: 16.99,
    year: 2010,
    stock: 24,
    description:
      "A groundbreaking study of how the War on Drugs gave birth to a system of mass incarceration that functions as a contemporary form of racial control, echoing the laws of the Jim Crow era.",
    color: "#3a3a6b",
  },
  {
    id: 13,
    title: "Braiding Sweetgrass",
    author: "Robin Wall Kimmerer",
    category: "social",
    categoryLabel: "Social Justice",
    price: 18.00,
    year: 2013,
    stock: 19,
    description:
      "A botanist and member of the Citizen Potawatomi Nation braids together Indigenous wisdom and scientific knowledge to offer a vision of the world in which people and plants are kin.",
    color: "#3a6b3a",
  },
  {
    id: 14,
    title: "Just Mercy",
    author: "Bryan Stevenson",
    category: "social",
    categoryLabel: "Social Justice",
    price: 15.99,
    year: 2014,
    stock: 30,
    description:
      "A powerful true story of justice and redemption, following attorney Bryan Stevenson's work defending those wrongly condemned or who were never given a fair chance.",
    color: "#6b4a2a",
  },

  // ── FANTASY ──────────────────────────────────────────────────
  {
    id: 15,
    title: "The Way of Kings",
    author: "Brandon Sanderson",
    category: "fantasy",
    categoryLabel: "Fantasy",
    price: 24.99,
    year: 2010,
    stock: 13,
    description:
      "The first book in the Stormlight Archive, set on a world ravaged by supernatural storms, where ancient armors and weapons of war are sought by three characters on very different paths.",
    color: "#2a5a6b",
  },
  {
    id: 16,
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    category: "fantasy",
    categoryLabel: "Fantasy",
    price: 13.99,
    year: 1968,
    stock: 22,
    description:
      "A young boy with extraordinary gifts goes to the school for wizards on the island of Roke and, seeking to prove himself, unleashes a terrible shadow upon the world.",
    color: "#4a2a6b",
  },
  {
    id: 17,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    category: "fantasy",
    categoryLabel: "Fantasy",
    price: 16.99,
    year: 2007,
    stock: 16,
    description:
      "The riveting first-person account of a magically gifted young man who grows to be the most notorious wizard his world has ever seen — told through flashback over three days.",
    color: "#6b5a2a",
  },
  {
    id: 18,
    title: "Piranesi",
    author: "Susanna Clarke",
    category: "fantasy",
    categoryLabel: "Fantasy",
    price: 14.99,
    year: 2020,
    stock: 20,
    description:
      "Piranesi lives in a mysterious house of infinite halls and tidal seas filled with statues. The house is all he knows. But clues suggest his past may be stranger — and darker — than he can imagine.",
    color: "#4a6b5a",
  },
];