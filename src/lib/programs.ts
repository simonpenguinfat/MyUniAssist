/**
 * Program taxonomy for the list builder.
 *
 * The CDS workbook has no program-level column, so program fit is modelled
 * here in two parts:
 *
 *  1. `PROGRAMS` – what a program *is*: the words a student is likely to use
 *     for it, and the activities that count as real preparation for it.
 *  2. `PROGRAM_LEADERS` – which of the 109 CDS schools are widely recognised
 *     in that program. Anything not listed falls back to the school's overall
 *     academic standing, so an unlisted school is never penalised, it just
 *     doesn't get a program-specific boost it hasn't earned.
 */

export type ProgramKey =
  | "computer-science"
  | "data-science"
  | "electrical-computer-engineering"
  | "mechanical-aerospace-engineering"
  | "civil-environmental-engineering"
  | "chemical-engineering"
  | "biomedical-engineering"
  | "materials-mining-engineering"
  | "biology-premed"
  | "chemistry"
  | "physics-astronomy"
  | "mathematics-statistics"
  | "environmental-science"
  | "neuroscience-psychology"
  | "business-finance"
  | "accounting"
  | "entrepreneurship"
  | "economics"
  | "political-science"
  | "international-relations"
  | "prelaw-criminal-justice"
  | "public-health"
  | "nursing"
  | "education"
  | "communications-journalism"
  | "film-media"
  | "performing-arts"
  | "art-design"
  | "architecture"
  | "english-writing"
  | "history"
  | "philosophy"
  | "sociology-anthropology"
  | "hospitality-tourism"
  | "agriculture-food-science"
  | "kinesiology-sports"
  | "aviation"
  | "linguistics-languages";

export type Program = {
  key: ProgramKey;
  label: string;
  /** How students actually write this major in a free-text box. */
  aliases: string[];
  /** Activities that read as genuine preparation for this program. */
  signalActivities: string[];
};

export const PROGRAMS: Program[] = [
  {
    key: "computer-science",
    label: "Computer Science",
    aliases: ["computer science", "cs", "software", "software engineering", "programming", "computing", "artificial intelligence", "ai", "machine learning", "cybersecurity", "game development"],
    signalActivities: ["hackathon", "robotics", "coding club", "competitive programming", "usaco", "app development", "open source", "ctf", "cyber patriot", "game jam"],
  },
  {
    key: "data-science",
    label: "Data Science & Analytics",
    aliases: ["data science", "data analytics", "analytics", "statistics and data", "informatics", "business analytics", "quantitative"],
    signalActivities: ["data club", "kaggle", "research", "statistics competition", "modeling competition", "hackathon"],
  },
  {
    key: "electrical-computer-engineering",
    label: "Electrical & Computer Engineering",
    aliases: ["electrical engineering", "ee", "computer engineering", "ece", "electronics", "embedded systems", "hardware"],
    signalActivities: ["robotics", "first robotics", "maker", "electronics club", "science olympiad", "drone club", "ham radio"],
  },
  {
    key: "mechanical-aerospace-engineering",
    label: "Mechanical & Aerospace Engineering",
    aliases: ["mechanical engineering", "me", "aerospace", "aeronautical", "astronautical", "aero", "automotive engineering"],
    signalActivities: ["robotics", "first robotics", "rocketry", "formula sae", "baja", "cad", "machine shop", "model rocketry", "science olympiad"],
  },
  {
    key: "civil-environmental-engineering",
    label: "Civil & Environmental Engineering",
    aliases: ["civil engineering", "environmental engineering", "structural engineering", "construction management", "transportation engineering"],
    signalActivities: ["habitat for humanity", "bridge building", "science olympiad", "sustainability club", "engineers without borders"],
  },
  {
    key: "chemical-engineering",
    label: "Chemical Engineering",
    aliases: ["chemical engineering", "chemE", "petroleum engineering", "process engineering"],
    signalActivities: ["chemistry olympiad", "science olympiad", "lab research", "science bowl"],
  },
  {
    key: "biomedical-engineering",
    label: "Biomedical Engineering",
    aliases: ["biomedical engineering", "bme", "bioengineering", "biotech", "biotechnology", "medical devices"],
    signalActivities: ["research", "hospital volunteering", "science fair", "isef", "biology olympiad", "prosthetics project"],
  },
  {
    key: "materials-mining-engineering",
    label: "Materials, Mining & Energy Engineering",
    aliases: ["materials science", "metallurgy", "mining engineering", "geological engineering", "energy engineering", "nuclear engineering"],
    signalActivities: ["science olympiad", "research", "geology club", "science fair"],
  },
  {
    key: "biology-premed",
    label: "Biology & Pre-Med",
    aliases: ["biology", "bio", "pre-med", "premed", "medicine", "molecular biology", "microbiology", "physiology", "biochemistry", "genetics"],
    signalActivities: ["hospital volunteering", "shadowing", "research", "hosa", "science olympiad", "biology olympiad", "ems", "red cross", "science fair"],
  },
  {
    key: "chemistry",
    label: "Chemistry",
    aliases: ["chemistry", "chem", "biochemistry", "pharmacy", "pharmaceutical"],
    signalActivities: ["chemistry olympiad", "science olympiad", "lab research", "science bowl", "science fair"],
  },
  {
    key: "physics-astronomy",
    label: "Physics & Astronomy",
    aliases: ["physics", "astronomy", "astrophysics", "cosmology", "quantum"],
    signalActivities: ["physics olympiad", "science olympiad", "astronomy club", "research", "science bowl", "telescope"],
  },
  {
    key: "mathematics-statistics",
    label: "Mathematics & Statistics",
    aliases: ["math", "mathematics", "applied math", "statistics", "actuarial science", "pure math"],
    signalActivities: ["math team", "amc", "aime", "usamo", "math olympiad", "mathcounts", "putnam", "math circle", "quiz bowl"],
  },
  {
    key: "environmental-science",
    label: "Environmental Science & Sustainability",
    aliases: ["environmental science", "sustainability", "ecology", "climate", "conservation", "earth science", "geology", "marine biology", "oceanography"],
    signalActivities: ["environmental club", "sustainability club", "conservation volunteering", "beach cleanup", "gardening", "scouting", "research"],
  },
  {
    key: "neuroscience-psychology",
    label: "Neuroscience & Psychology",
    aliases: ["neuroscience", "psychology", "psych", "cognitive science", "behavioral science", "counseling", "mental health"],
    signalActivities: ["research", "peer counseling", "mental health club", "psychology club", "volunteering", "crisis line"],
  },
  {
    key: "business-finance",
    label: "Business & Finance",
    aliases: ["business", "finance", "management", "marketing", "supply chain", "real estate", "investment", "banking", "consulting"],
    signalActivities: ["deca", "fbla", "investment club", "student business", "internship", "model un", "stock market game", "junior achievement"],
  },
  {
    key: "accounting",
    label: "Accounting",
    aliases: ["accounting", "cpa", "audit", "taxation"],
    signalActivities: ["fbla", "deca", "treasurer", "bookkeeping", "internship", "vita tax volunteer"],
  },
  {
    key: "entrepreneurship",
    label: "Entrepreneurship & Innovation",
    aliases: ["entrepreneurship", "startup", "innovation", "venture", "small business"],
    signalActivities: ["startup", "founded", "business", "etsy", "reselling", "pitch competition", "deca", "incubator", "nonprofit founder"],
  },
  {
    key: "economics",
    label: "Economics",
    aliases: ["economics", "econ", "political economy", "econometrics"],
    signalActivities: ["economics club", "fed challenge", "econ olympiad", "debate", "model un", "investment club", "research"],
  },
  {
    key: "political-science",
    label: "Political Science & Government",
    aliases: ["political science", "politics", "government", "public policy", "public administration", "civics"],
    signalActivities: ["model un", "debate", "student government", "campaign volunteering", "mock trial", "youth in government", "civic engagement"],
  },
  {
    key: "international-relations",
    label: "International Relations & Global Studies",
    aliases: ["international relations", "international affairs", "global studies", "diplomacy", "foreign service", "area studies"],
    signalActivities: ["model un", "debate", "language club", "exchange program", "cultural club", "travel", "translation volunteering"],
  },
  {
    key: "prelaw-criminal-justice",
    label: "Pre-Law & Criminal Justice",
    aliases: ["pre-law", "prelaw", "law", "legal studies", "criminal justice", "criminology", "forensics"],
    signalActivities: ["mock trial", "debate", "moot court", "student government", "legal internship", "teen court"],
  },
  {
    key: "public-health",
    label: "Public Health",
    aliases: ["public health", "epidemiology", "health policy", "global health", "health sciences", "community health"],
    signalActivities: ["hosa", "red cross", "health volunteering", "vaccination drive", "peer health", "nonprofit", "research"],
  },
  {
    key: "nursing",
    label: "Nursing & Allied Health",
    aliases: ["nursing", "rn", "bsn", "physician assistant", "physical therapy", "occupational therapy", "athletic training", "respiratory therapy"],
    signalActivities: ["hosa", "cna", "hospital volunteering", "ems", "cpr instructor", "red cross", "caregiving"],
  },
  {
    key: "education",
    label: "Education & Teaching",
    aliases: ["education", "teaching", "early childhood", "special education", "curriculum", "elementary education"],
    signalActivities: ["tutoring", "teaching assistant", "camp counselor", "coaching", "mentoring", "educators rising", "sunday school"],
  },
  {
    key: "communications-journalism",
    label: "Communications & Journalism",
    aliases: ["communications", "journalism", "public relations", "advertising", "media studies", "broadcasting", "strategic communication"],
    signalActivities: ["school newspaper", "yearbook", "podcast", "radio", "blog", "debate", "press", "social media manager"],
  },
  {
    key: "film-media",
    label: "Film, TV & Digital Media",
    aliases: ["film", "cinema", "television", "video production", "animation", "game design", "digital media", "screenwriting", "visual effects"],
    signalActivities: ["film club", "video production", "youtube", "animation", "photography", "film festival", "theater tech"],
  },
  {
    key: "performing-arts",
    label: "Music, Theatre & Dance",
    aliases: ["music", "theatre", "theater", "drama", "dance", "musical theatre", "performance", "composition", "vocal", "orchestra", "conservatory"],
    signalActivities: ["orchestra", "band", "choir", "marching band", "theater", "drama club", "dance", "musical", "a cappella", "jazz", "recital", "audition"],
  },
  {
    key: "art-design",
    label: "Art & Design",
    aliases: ["art", "fine arts", "graphic design", "industrial design", "illustration", "studio art", "fashion", "ux design", "product design"],
    signalActivities: ["art club", "portfolio", "scholastic art", "design", "ceramics", "photography", "mural", "fashion"],
  },
  {
    key: "architecture",
    label: "Architecture & Urban Planning",
    aliases: ["architecture", "urban planning", "landscape architecture", "urban design", "interior design"],
    signalActivities: ["architecture club", "cad", "design portfolio", "habitat for humanity", "model building", "art club"],
  },
  {
    key: "english-writing",
    label: "English & Creative Writing",
    aliases: ["english", "literature", "creative writing", "comparative literature", "rhetoric", "poetry"],
    signalActivities: ["literary magazine", "school newspaper", "writing club", "poetry", "novel", "scholastic writing", "book club", "debate"],
  },
  {
    key: "history",
    label: "History & Classics",
    aliases: ["history", "classics", "archaeology", "art history", "medieval studies", "american studies"],
    signalActivities: ["history day", "quiz bowl", "certamen", "museum volunteering", "debate", "research", "historical society"],
  },
  {
    key: "philosophy",
    label: "Philosophy & Religious Studies",
    aliases: ["philosophy", "ethics", "religious studies", "theology", "divinity"],
    signalActivities: ["ethics bowl", "debate", "philosophy club", "quiz bowl", "youth group", "model un"],
  },
  {
    key: "sociology-anthropology",
    label: "Sociology & Anthropology",
    aliases: ["sociology", "anthropology", "social work", "human services", "gender studies", "ethnic studies", "urban studies"],
    signalActivities: ["community service", "nonprofit", "volunteering", "cultural club", "advocacy", "research", "tutoring"],
  },
  {
    key: "hospitality-tourism",
    label: "Hospitality & Tourism Management",
    aliases: ["hospitality", "hotel management", "tourism", "culinary", "event management", "restaurant management"],
    signalActivities: ["deca", "fccla", "restaurant job", "event planning", "catering", "customer service job"],
  },
  {
    key: "agriculture-food-science",
    label: "Agriculture, Food & Animal Science",
    aliases: ["agriculture", "agricultural science", "food science", "animal science", "veterinary", "pre-vet", "horticulture", "forestry", "nutrition", "dietetics"],
    signalActivities: ["ffa", "4-h", "farm work", "animal shelter", "veterinary shadowing", "gardening", "equestrian"],
  },
  {
    key: "kinesiology-sports",
    label: "Kinesiology & Sport Management",
    aliases: ["kinesiology", "exercise science", "sports management", "sports medicine", "athletic administration", "recreation"],
    signalActivities: ["varsity athletics", "team captain", "coaching", "athletic training", "intramurals", "referee", "personal training"],
  },
  {
    key: "aviation",
    label: "Aviation & Aeronautical Science",
    aliases: ["aviation", "pilot", "flight", "air traffic control", "aeronautical science", "airport management"],
    signalActivities: ["civil air patrol", "flight lessons", "private pilot", "aviation club", "drone club", "jrotc"],
  },
  {
    key: "linguistics-languages",
    label: "Linguistics & World Languages",
    aliases: ["linguistics", "spanish", "french", "chinese", "japanese", "german", "arabic", "russian", "translation", "world languages", "esl"],
    signalActivities: ["language club", "national language exam", "translation volunteering", "exchange program", "tutoring", "cultural club"],
  },
];

export const PROGRAMS_BY_KEY: Map<ProgramKey, Program> = new Map(
  PROGRAMS.map((p) => [p.key, p])
);

/**
 * Schools among the 109 CDS institutions that are widely recognised in a
 * program. `standout` is a national-reputation tier; `strong` is a solid,
 * well-known department. Unlisted schools score from overall standing only.
 */
export const PROGRAM_LEADERS: Record<
  ProgramKey,
  { standout: string[]; strong: string[] }
> = {
  "computer-science": {
    standout: [
      "massachusetts-institute-of-technology",
      "carnegie-mellon-university",
      "stanford-university",
      "university-of-california-berkeley",
      "university-of-illinois-urbana-champaign",
      "california-institute-of-technology",
      "cornell-university",
      "university-of-washington",
      "georgia-institute-of-technology",
      "princeton-university",
    ],
    strong: [
      "harvard-university",
      "university-of-michigan-ann-arbor",
      "columbia-university",
      "university-of-texas-at-austin",
      "university-of-california-los-angeles",
      "university-of-california-san-diego",
      "purdue-university",
      "university-of-wisconsin-madison",
      "university-of-maryland-college-park",
      "university-of-pennsylvania",
      "northwestern-university",
      "rice-university",
      "university-of-chicago",
      "yale-university",
      "brown-university",
      "duke-university",
      "johns-hopkins-university",
      "northeastern-university",
      "university-of-southern-california",
      "rochester-institute-of-technology",
      "worcester-polytechnic-institute",
      "stony-brook-university",
      "rutgers-university-new-brunswick",
      "virginia-tech",
      "university-of-massachusetts-amherst",
      "ohio-state-university",
      "university-of-minnesota-twin-cities",
      "new-york-university",
      "stevens-institute-of-technology",
      "rensselaer-polytechnic-institute",
      "university-of-california-irvine",
      "university-of-california-santa-barbara",
    ],
  },
  "data-science": {
    standout: [
      "carnegie-mellon-university",
      "university-of-california-berkeley",
      "stanford-university",
      "massachusetts-institute-of-technology",
      "university-of-chicago",
    ],
    strong: [
      "harvard-university",
      "university-of-washington",
      "columbia-university",
      "new-york-university",
      "university-of-michigan-ann-arbor",
      "duke-university",
      "university-of-wisconsin-madison",
      "university-of-illinois-urbana-champaign",
      "purdue-university",
      "university-of-texas-at-austin",
      "northwestern-university",
      "university-of-california-los-angeles",
      "university-of-california-san-diego",
      "university-of-minnesota-twin-cities",
      "ohio-state-university",
      "pennsylvania-state-university",
    ],
  },
  "electrical-computer-engineering": {
    standout: [
      "massachusetts-institute-of-technology",
      "stanford-university",
      "university-of-california-berkeley",
      "university-of-illinois-urbana-champaign",
      "georgia-institute-of-technology",
      "california-institute-of-technology",
      "carnegie-mellon-university",
    ],
    strong: [
      "purdue-university",
      "university-of-michigan-ann-arbor",
      "cornell-university",
      "university-of-texas-at-austin",
      "princeton-university",
      "university-of-california-los-angeles",
      "university-of-southern-california",
      "virginia-tech",
      "university-of-maryland-college-park",
      "ohio-state-university",
      "rensselaer-polytechnic-institute",
      "university-of-washington",
      "texas-a-and-m-university",
      "north-carolina-state-university",
      "stevens-institute-of-technology",
      "new-jersey-institute-of-technology",
      "rochester-institute-of-technology",
      "university-of-wisconsin-madison",
      "pennsylvania-state-university",
      "lehigh-university",
    ],
  },
  "mechanical-aerospace-engineering": {
    standout: [
      "massachusetts-institute-of-technology",
      "california-institute-of-technology",
      "georgia-institute-of-technology",
      "university-of-michigan-ann-arbor",
      "purdue-university",
      "stanford-university",
      "university-of-california-berkeley",
    ],
    strong: [
      "university-of-illinois-urbana-champaign",
      "texas-a-and-m-university",
      "virginia-tech",
      "cornell-university",
      "university-of-texas-at-austin",
      "university-of-maryland-college-park",
      "princeton-university",
      "rensselaer-polytechnic-institute",
      "pennsylvania-state-university",
      "ohio-state-university",
      "north-carolina-state-university",
      "university-of-colorado-boulder",
      "worcester-polytechnic-institute",
      "case-western-reserve-university",
      "university-of-washington",
      "auburn-university",
      "clemson-university",
      "university-of-minnesota-twin-cities",
    ],
  },
  "civil-environmental-engineering": {
    standout: [
      "university-of-california-berkeley",
      "university-of-illinois-urbana-champaign",
      "georgia-institute-of-technology",
      "stanford-university",
      "virginia-tech",
    ],
    strong: [
      "purdue-university",
      "university-of-texas-at-austin",
      "texas-a-and-m-university",
      "cornell-university",
      "university-of-michigan-ann-arbor",
      "north-carolina-state-university",
      "pennsylvania-state-university",
      "colorado-school-of-mines",
      "university-of-colorado-boulder",
      "auburn-university",
      "clemson-university",
      "lehigh-university",
      "university-of-washington",
      "drexel-university",
      "worcester-polytechnic-institute",
    ],
  },
  "chemical-engineering": {
    standout: [
      "massachusetts-institute-of-technology",
      "university-of-california-berkeley",
      "california-institute-of-technology",
      "university-of-minnesota-twin-cities",
      "university-of-texas-at-austin",
    ],
    strong: [
      "university-of-wisconsin-madison",
      "georgia-institute-of-technology",
      "princeton-university",
      "stanford-university",
      "university-of-illinois-urbana-champaign",
      "purdue-university",
      "cornell-university",
      "university-of-michigan-ann-arbor",
      "texas-a-and-m-university",
      "university-of-delaware",
      "north-carolina-state-university",
      "lehigh-university",
      "ohio-state-university",
      "pennsylvania-state-university",
      "rensselaer-polytechnic-institute",
      "university-of-florida",
    ],
  },
  "biomedical-engineering": {
    standout: [
      "johns-hopkins-university",
      "georgia-institute-of-technology",
      "duke-university",
      "massachusetts-institute-of-technology",
      "university-of-california-san-diego",
    ],
    strong: [
      "stanford-university",
      "university-of-pennsylvania",
      "rice-university",
      "university-of-michigan-ann-arbor",
      "case-western-reserve-university",
      "boston-university",
      "washington-university-in-st-louis",
      "columbia-university",
      "vanderbilt-university",
      "cornell-university",
      "northwestern-university",
      "university-of-washington",
      "university-of-texas-at-austin",
      "drexel-university",
      "worcester-polytechnic-institute",
      "rensselaer-polytechnic-institute",
      "university-of-rochester",
      "university-of-miami",
    ],
  },
  "materials-mining-engineering": {
    standout: [
      "massachusetts-institute-of-technology",
      "colorado-school-of-mines",
      "university-of-california-berkeley",
      "northwestern-university",
    ],
    strong: [
      "georgia-institute-of-technology",
      "university-of-illinois-urbana-champaign",
      "university-of-michigan-ann-arbor",
      "pennsylvania-state-university",
      "purdue-university",
      "carnegie-mellon-university",
      "cornell-university",
      "rensselaer-polytechnic-institute",
      "lehigh-university",
      "ohio-state-university",
      "texas-a-and-m-university",
      "university-of-florida",
    ],
  },
  "biology-premed": {
    standout: [
      "harvard-university",
      "stanford-university",
      "johns-hopkins-university",
      "massachusetts-institute-of-technology",
      "duke-university",
      "washington-university-in-st-louis",
      "university-of-california-berkeley",
    ],
    strong: [
      "yale-university",
      "columbia-university",
      "cornell-university",
      "university-of-pennsylvania",
      "university-of-california-los-angeles",
      "university-of-michigan-ann-arbor",
      "university-of-chicago",
      "northwestern-university",
      "emory-university",
      "vanderbilt-university",
      "university-of-north-carolina-at-chapel-hill",
      "university-of-california-san-diego",
      "case-western-reserve-university",
      "university-of-rochester",
      "boston-university",
      "university-of-wisconsin-madison",
      "university-of-florida",
      "university-of-pittsburgh",
      "tulane-university",
      "university-of-miami",
      "brandeis-university",
      "stony-brook-university",
      "university-of-texas-at-austin",
    ],
  },
  chemistry: {
    standout: [
      "california-institute-of-technology",
      "massachusetts-institute-of-technology",
      "university-of-california-berkeley",
      "harvard-university",
      "stanford-university",
    ],
    strong: [
      "northwestern-university",
      "university-of-illinois-urbana-champaign",
      "university-of-wisconsin-madison",
      "university-of-chicago",
      "columbia-university",
      "cornell-university",
      "yale-university",
      "princeton-university",
      "university-of-texas-at-austin",
      "purdue-university",
      "university-of-north-carolina-at-chapel-hill",
      "university-of-michigan-ann-arbor",
      "pennsylvania-state-university",
      "university-of-minnesota-twin-cities",
      "rice-university",
    ],
  },
  "physics-astronomy": {
    standout: [
      "massachusetts-institute-of-technology",
      "california-institute-of-technology",
      "princeton-university",
      "harvard-university",
      "stanford-university",
      "university-of-california-berkeley",
      "university-of-chicago",
    ],
    strong: [
      "cornell-university",
      "columbia-university",
      "yale-university",
      "university-of-illinois-urbana-champaign",
      "university-of-california-santa-barbara",
      "university-of-michigan-ann-arbor",
      "university-of-maryland-college-park",
      "university-of-texas-at-austin",
      "university-of-washington",
      "university-of-wisconsin-madison",
      "university-of-colorado-boulder",
      "rice-university",
      "stony-brook-university",
      "ohio-state-university",
      "university-of-rochester",
    ],
  },
  "mathematics-statistics": {
    standout: [
      "massachusetts-institute-of-technology",
      "princeton-university",
      "harvard-university",
      "stanford-university",
      "university-of-california-berkeley",
      "university-of-chicago",
      "california-institute-of-technology",
    ],
    strong: [
      "yale-university",
      "columbia-university",
      "cornell-university",
      "carnegie-mellon-university",
      "university-of-michigan-ann-arbor",
      "university-of-california-los-angeles",
      "university-of-wisconsin-madison",
      "university-of-texas-at-austin",
      "brown-university",
      "duke-university",
      "northwestern-university",
      "university-of-illinois-urbana-champaign",
      "university-of-minnesota-twin-cities",
      "purdue-university",
      "rice-university",
      "university-of-maryland-college-park",
    ],
  },
  "environmental-science": {
    standout: [
      "university-of-california-berkeley",
      "university-of-california-santa-barbara",
      "stanford-university",
      "university-of-california-davis",
      "university-of-washington",
    ],
    strong: [
      "cornell-university",
      "duke-university",
      "yale-university",
      "university-of-michigan-ann-arbor",
      "university-of-colorado-boulder",
      "university-of-florida",
      "university-of-wisconsin-madison",
      "university-of-california-santa-cruz",
      "university-of-miami",
      "virginia-tech",
      "pennsylvania-state-university",
      "university-of-minnesota-twin-cities",
      "texas-a-and-m-university",
      "north-carolina-state-university",
    ],
  },
  "neuroscience-psychology": {
    standout: [
      "stanford-university",
      "harvard-university",
      "university-of-california-berkeley",
      "princeton-university",
      "massachusetts-institute-of-technology",
      "yale-university",
    ],
    strong: [
      "university-of-california-los-angeles",
      "university-of-michigan-ann-arbor",
      "university-of-pennsylvania",
      "columbia-university",
      "duke-university",
      "university-of-chicago",
      "northwestern-university",
      "brown-university",
      "washington-university-in-st-louis",
      "vanderbilt-university",
      "university-of-north-carolina-at-chapel-hill",
      "university-of-wisconsin-madison",
      "university-of-illinois-urbana-champaign",
      "university-of-minnesota-twin-cities",
      "emory-university",
      "brandeis-university",
      "university-of-rochester",
      "boston-university",
    ],
  },
  "business-finance": {
    standout: [
      "university-of-pennsylvania",
      "massachusetts-institute-of-technology",
      "university-of-california-berkeley",
      "university-of-michigan-ann-arbor",
      "new-york-university",
      "university-of-texas-at-austin",
    ],
    strong: [
      "carnegie-mellon-university",
      "cornell-university",
      "university-of-southern-california",
      "university-of-virginia",
      "university-of-north-carolina-at-chapel-hill",
      "indiana-university-bloomington",
      "emory-university",
      "washington-university-in-st-louis",
      "georgetown-university",
      "university-of-notre-dame",
      "boston-college",
      "villanova-university",
      "ohio-state-university",
      "university-of-wisconsin-madison",
      "university-of-illinois-urbana-champaign",
      "university-of-minnesota-twin-cities",
      "pennsylvania-state-university",
      "purdue-university",
      "texas-a-and-m-university",
      "university-of-florida",
      "university-of-georgia",
      "boston-university",
      "northeastern-university",
      "fordham-university",
      "santa-clara-university",
      "southern-methodist-university",
      "texas-christian-university",
      "marquette-university",
      "baylor-university",
      "university-of-maryland-college-park",
      "university-of-washington",
    ],
  },
  accounting: {
    standout: [
      "university-of-texas-at-austin",
      "university-of-illinois-urbana-champaign",
      "university-of-pennsylvania",
      "university-of-southern-california",
    ],
    strong: [
      "indiana-university-bloomington",
      "university-of-notre-dame",
      "ohio-state-university",
      "university-of-michigan-ann-arbor",
      "villanova-university",
      "boston-college",
      "university-of-florida",
      "university-of-georgia",
      "pennsylvania-state-university",
      "texas-a-and-m-university",
      "university-of-wisconsin-madison",
      "marquette-university",
      "santa-clara-university",
      "fordham-university",
      "baylor-university",
      "saint-louis-university",
    ],
  },
  entrepreneurship: {
    standout: [
      "massachusetts-institute-of-technology",
      "stanford-university",
      "university-of-pennsylvania",
      "university-of-southern-california",
    ],
    strong: [
      "university-of-california-berkeley",
      "university-of-michigan-ann-arbor",
      "carnegie-mellon-university",
      "cornell-university",
      "new-york-university",
      "northwestern-university",
      "university-of-texas-at-austin",
      "santa-clara-university",
      "syracuse-university",
      "temple-university",
      "northeastern-university",
      "university-of-washington",
      "rice-university",
      "brown-university",
      "southern-methodist-university",
    ],
  },
  economics: {
    standout: [
      "harvard-university",
      "massachusetts-institute-of-technology",
      "stanford-university",
      "princeton-university",
      "university-of-chicago",
      "university-of-california-berkeley",
      "yale-university",
    ],
    strong: [
      "northwestern-university",
      "columbia-university",
      "university-of-pennsylvania",
      "new-york-university",
      "university-of-michigan-ann-arbor",
      "duke-university",
      "cornell-university",
      "brown-university",
      "university-of-california-los-angeles",
      "university-of-wisconsin-madison",
      "university-of-virginia",
      "georgetown-university",
      "vanderbilt-university",
      "university-of-california-san-diego",
      "boston-college",
      "university-of-maryland-college-park",
    ],
  },
  "political-science": {
    standout: [
      "harvard-university",
      "stanford-university",
      "princeton-university",
      "university-of-michigan-ann-arbor",
      "georgetown-university",
      "yale-university",
    ],
    strong: [
      "university-of-california-berkeley",
      "columbia-university",
      "university-of-chicago",
      "george-washington-university",
      "american-university",
      "duke-university",
      "university-of-california-los-angeles",
      "university-of-north-carolina-at-chapel-hill",
      "university-of-virginia",
      "university-of-wisconsin-madison",
      "ohio-state-university",
      "university-of-texas-at-austin",
      "syracuse-university",
      "boston-college",
      "university-of-notre-dame",
      "william-and-mary",
      "howard-university",
    ],
  },
  "international-relations": {
    standout: [
      "georgetown-university",
      "harvard-university",
      "princeton-university",
      "johns-hopkins-university",
      "american-university",
      "tufts-university",
    ],
    strong: [
      "columbia-university",
      "george-washington-university",
      "stanford-university",
      "yale-university",
      "university-of-chicago",
      "university-of-california-berkeley",
      "university-of-southern-california",
      "syracuse-university",
      "boston-university",
      "university-of-michigan-ann-arbor",
      "william-and-mary",
      "brandeis-university",
      "fordham-university",
      "university-of-virginia",
      "howard-university",
    ],
  },
  "prelaw-criminal-justice": {
    standout: [
      "harvard-university",
      "yale-university",
      "stanford-university",
      "university-of-chicago",
      "georgetown-university",
    ],
    strong: [
      "columbia-university",
      "university-of-virginia",
      "university-of-michigan-ann-arbor",
      "university-of-california-berkeley",
      "duke-university",
      "northwestern-university",
      "university-of-pennsylvania",
      "american-university",
      "george-washington-university",
      "william-and-mary",
      "university-of-maryland-college-park",
      "michigan-state-university",
      "florida-state-university",
      "temple-university",
      "howard-university",
      "rutgers-university-newark",
      "university-of-south-florida",
    ],
  },
  "public-health": {
    standout: [
      "johns-hopkins-university",
      "harvard-university",
      "university-of-north-carolina-at-chapel-hill",
      "emory-university",
      "university-of-michigan-ann-arbor",
    ],
    strong: [
      "columbia-university",
      "university-of-california-berkeley",
      "university-of-california-los-angeles",
      "boston-university",
      "university-of-washington",
      "brown-university",
      "university-of-minnesota-twin-cities",
      "university-of-pittsburgh",
      "tulane-university",
      "george-washington-university",
      "university-of-south-florida",
      "university-of-florida",
      "ohio-state-university",
      "rutgers-university-new-brunswick",
      "drexel-university",
      "temple-university",
    ],
  },
  nursing: {
    standout: [
      "university-of-pennsylvania",
      "university-of-washington",
      "university-of-michigan-ann-arbor",
      "university-of-north-carolina-at-chapel-hill",
      "emory-university",
    ],
    strong: [
      "university-of-pittsburgh",
      "case-western-reserve-university",
      "boston-college",
      "new-york-university",
      "ohio-state-university",
      "university-of-maryland-college-park",
      "villanova-university",
      "marquette-university",
      "saint-louis-university",
      "university-of-miami",
      "university-of-connecticut",
      "university-of-delaware",
      "drexel-university",
      "temple-university",
      "gonzaga-university",
      "loyola-marymount-university",
      "university-of-iowa",
      "university-of-minnesota-twin-cities",
    ],
  },
  education: {
    standout: [
      "harvard-university",
      "stanford-university",
      "university-of-wisconsin-madison",
      "vanderbilt-university",
    ],
    strong: [
      "university-of-michigan-ann-arbor",
      "michigan-state-university",
      "ohio-state-university",
      "university-of-texas-at-austin",
      "university-of-washington",
      "university-of-virginia",
      "indiana-university-bloomington",
      "pennsylvania-state-university",
      "university-of-florida",
      "university-of-georgia",
      "boston-college",
      "university-of-maryland-college-park",
      "university-of-minnesota-twin-cities",
      "university-of-missouri",
      "university-of-iowa",
      "temple-university",
    ],
  },
  "communications-journalism": {
    standout: [
      "northwestern-university",
      "university-of-missouri",
      "syracuse-university",
      "university-of-southern-california",
      "university-of-texas-at-austin",
    ],
    strong: [
      "university-of-north-carolina-at-chapel-hill",
      "university-of-florida",
      "university-of-georgia",
      "indiana-university-bloomington",
      "boston-university",
      "new-york-university",
      "american-university",
      "george-washington-university",
      "university-of-maryland-college-park",
      "michigan-state-university",
      "pennsylvania-state-university",
      "university-of-wisconsin-madison",
      "university-of-miami",
      "fordham-university",
      "temple-university",
      "howard-university",
      "marquette-university",
      "texas-christian-university",
    ],
  },
  "film-media": {
    standout: [
      "university-of-southern-california",
      "new-york-university",
      "university-of-california-los-angeles",
      "rochester-institute-of-technology",
      "carnegie-mellon-university",
    ],
    strong: [
      "northwestern-university",
      "boston-university",
      "syracuse-university",
      "university-of-texas-at-austin",
      "loyola-marymount-university",
      "florida-state-university",
      "university-of-miami",
      "temple-university",
      "drexel-university",
      "pepperdine-university",
      "santa-clara-university",
      "university-of-california-santa-cruz",
    ],
  },
  "performing-arts": {
    standout: [
      "carnegie-mellon-university",
      "northwestern-university",
      "university-of-michigan-ann-arbor",
      "yale-university",
    ],
    strong: [
      "university-of-southern-california",
      "new-york-university",
      "indiana-university-bloomington",
      "rice-university",
      "boston-university",
      "university-of-rochester",
      "university-of-texas-at-austin",
      "florida-state-university",
      "university-of-miami",
      "syracuse-university",
      "temple-university",
      "baylor-university",
      "pepperdine-university",
      "loyola-marymount-university",
      "university-of-illinois-urbana-champaign",
    ],
  },
  "art-design": {
    standout: [
      "carnegie-mellon-university",
      "yale-university",
      "university-of-california-los-angeles",
      "rochester-institute-of-technology",
    ],
    strong: [
      "university-of-southern-california",
      "new-york-university",
      "ohio-state-university",
      "university-of-michigan-ann-arbor",
      "university-of-texas-at-austin",
      "virginia-tech",
      "syracuse-university",
      "temple-university",
      "drexel-university",
      "university-of-illinois-urbana-champaign",
      "purdue-university",
      "university-of-washington",
      "loyola-marymount-university",
    ],
  },
  architecture: {
    standout: [
      "cornell-university",
      "rice-university",
      "syracuse-university",
      "california-institute-of-technology",
      "virginia-tech",
    ],
    strong: [
      "university-of-texas-at-austin",
      "university-of-southern-california",
      "carnegie-mellon-university",
      "university-of-michigan-ann-arbor",
      "columbia-university",
      "rensselaer-polytechnic-institute",
      "university-of-illinois-urbana-champaign",
      "pennsylvania-state-university",
      "university-of-florida",
      "auburn-university",
      "clemson-university",
      "temple-university",
      "drexel-university",
      "university-of-maryland-college-park",
      "university-of-washington",
      "university-of-notre-dame",
    ],
  },
  "english-writing": {
    standout: [
      "harvard-university",
      "yale-university",
      "princeton-university",
      "university-of-chicago",
      "columbia-university",
      "brown-university",
    ],
    strong: [
      "stanford-university",
      "university-of-california-berkeley",
      "cornell-university",
      "university-of-virginia",
      "university-of-michigan-ann-arbor",
      "johns-hopkins-university",
      "northwestern-university",
      "university-of-pennsylvania",
      "duke-university",
      "emory-university",
      "vanderbilt-university",
      "university-of-iowa",
      "boston-college",
      "fordham-university",
      "william-and-mary",
      "wake-forest-university",
    ],
  },
  history: {
    standout: [
      "harvard-university",
      "yale-university",
      "princeton-university",
      "stanford-university",
      "university-of-chicago",
      "university-of-california-berkeley",
    ],
    strong: [
      "columbia-university",
      "university-of-michigan-ann-arbor",
      "brown-university",
      "cornell-university",
      "university-of-virginia",
      "university-of-north-carolina-at-chapel-hill",
      "northwestern-university",
      "university-of-wisconsin-madison",
      "william-and-mary",
      "georgetown-university",
      "university-of-notre-dame",
      "brandeis-university",
      "fordham-university",
      "university-of-texas-at-austin",
    ],
  },
  philosophy: {
    standout: [
      "princeton-university",
      "harvard-university",
      "yale-university",
      "massachusetts-institute-of-technology",
      "university-of-chicago",
      "university-of-california-berkeley",
    ],
    strong: [
      "stanford-university",
      "columbia-university",
      "brown-university",
      "university-of-michigan-ann-arbor",
      "cornell-university",
      "university-of-notre-dame",
      "georgetown-university",
      "boston-college",
      "university-of-north-carolina-at-chapel-hill",
      "rutgers-university-new-brunswick",
      "yeshiva-university",
      "saint-louis-university",
      "marquette-university",
      "fordham-university",
    ],
  },
  "sociology-anthropology": {
    standout: [
      "university-of-california-berkeley",
      "harvard-university",
      "university-of-chicago",
      "princeton-university",
      "university-of-michigan-ann-arbor",
    ],
    strong: [
      "stanford-university",
      "university-of-wisconsin-madison",
      "university-of-north-carolina-at-chapel-hill",
      "columbia-university",
      "university-of-california-los-angeles",
      "northwestern-university",
      "new-york-university",
      "university-of-texas-at-austin",
      "brown-university",
      "washington-university-in-st-louis",
      "howard-university",
      "temple-university",
      "rutgers-university-new-brunswick",
      "university-of-massachusetts-amherst",
    ],
  },
  "hospitality-tourism": {
    standout: [
      "cornell-university",
      "michigan-state-university",
      "university-of-south-florida",
      "florida-international-university",
    ],
    strong: [
      "pennsylvania-state-university",
      "purdue-university",
      "virginia-tech",
      "university-of-massachusetts-amherst",
      "temple-university",
      "auburn-university",
      "clemson-university",
      "university-of-delaware",
      "university-of-missouri",
      "university-of-tennessee-knoxville",
    ],
  },
  "agriculture-food-science": {
    standout: [
      "university-of-california-davis",
      "cornell-university",
      "texas-a-and-m-university",
      "purdue-university",
      "university-of-wisconsin-madison",
    ],
    strong: [
      "university-of-illinois-urbana-champaign",
      "michigan-state-university",
      "north-carolina-state-university",
      "ohio-state-university",
      "pennsylvania-state-university",
      "university-of-florida",
      "university-of-georgia",
      "virginia-tech",
      "auburn-university",
      "clemson-university",
      "university-of-minnesota-twin-cities",
      "university-of-missouri",
      "university-of-tennessee-knoxville",
      "rutgers-university-new-brunswick",
      "university-of-delaware",
    ],
  },
  "kinesiology-sports": {
    standout: [
      "university-of-michigan-ann-arbor",
      "ohio-state-university",
      "university-of-texas-at-austin",
      "pennsylvania-state-university",
      "university-of-massachusetts-amherst",
    ],
    strong: [
      "michigan-state-university",
      "indiana-university-bloomington",
      "university-of-florida",
      "university-of-georgia",
      "university-of-wisconsin-madison",
      "syracuse-university",
      "university-of-connecticut",
      "university-of-miami",
      "baylor-university",
      "auburn-university",
      "clemson-university",
      "university-of-tennessee-knoxville",
      "university-of-iowa",
      "temple-university",
      "marquette-university",
      "gonzaga-university",
    ],
  },
  aviation: {
    standout: [
      "purdue-university",
      "ohio-state-university",
      "auburn-university",
    ],
    strong: [
      "massachusetts-institute-of-technology",
      "georgia-institute-of-technology",
      "pennsylvania-state-university",
      "university-of-illinois-urbana-champaign",
      "texas-a-and-m-university",
      "florida-international-university",
      "university-of-south-florida",
    ],
  },
  "linguistics-languages": {
    standout: [
      "massachusetts-institute-of-technology",
      "stanford-university",
      "university-of-california-berkeley",
      "harvard-university",
      "georgetown-university",
    ],
    strong: [
      "university-of-chicago",
      "university-of-california-los-angeles",
      "university-of-massachusetts-amherst",
      "cornell-university",
      "university-of-michigan-ann-arbor",
      "yale-university",
      "university-of-pennsylvania",
      "brandeis-university",
      "university-of-texas-at-austin",
      "indiana-university-bloomington",
      "ohio-state-university",
      "american-university",
    ],
  },
};

export type ProgramTier = "standout" | "strong" | "general";

/** Where a school sits for one program. Unlisted schools return "general". */
export function programTier(universityId: string, key: ProgramKey): ProgramTier {
  const leaders = PROGRAM_LEADERS[key];
  if (!leaders) return "general";
  if (leaders.standout.includes(universityId)) return "standout";
  if (leaders.strong.includes(universityId)) return "strong";
  return "general";
}

function normalize(raw: string) {
  return ` ${raw.toLowerCase().replace(/[^a-z0-9+#]+/g, " ").replace(/\s+/g, " ").trim()} `;
}

/**
 * Best-effort mapping from a student's free-text major/interest wording to
 * program keys. Longer aliases are checked first so "computer engineering"
 * does not get swallowed by "computer science"'s "computing".
 */
export function matchPrograms(raw: string, limit = 3): ProgramKey[] {
  const haystack = normalize(raw);
  if (haystack.trim().length === 0) return [];

  const scored: { key: ProgramKey; score: number }[] = [];
  for (const program of PROGRAMS) {
    let score = 0;
    for (const alias of program.aliases) {
      const needle = normalize(alias).trim();
      if (!needle) continue;
      if (haystack.includes(` ${needle} `)) {
        // Longer, more specific aliases outrank short generic ones.
        score = Math.max(score, needle.length >= 6 ? 3 : 2);
      }
    }
    if (score > 0) scored.push({ key: program.key, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.key);
}

/** How many of a program's signal activities show up in the student's list. */
export function activityAlignment(activitiesText: string, key: ProgramKey): number {
  const program = PROGRAMS_BY_KEY.get(key);
  if (!program) return 0;
  const haystack = normalize(activitiesText);
  let hits = 0;
  for (const signal of program.signalActivities) {
    if (haystack.includes(normalize(signal).trim())) hits += 1;
  }
  return hits;
}
