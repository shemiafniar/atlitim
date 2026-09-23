import { uid } from "@/lib/utils";
import type {
  Business,
  BusinessHour,
  BusinessImage,
  CatalogStore,
  Category,
  CategoryLink,
  DayOfWeek,
  Recommendation,
  Subcategory,
  Tag,
} from "@/types";

export const SEED_VERSION = 1;
const LOCALITY_ID = uid(1);
const NOW = "2026-09-20T09:00:00.000Z";

const categoryDefs = [
  {
    slug: "food",
    name: "אוכל ומשלוחים",
    icon: "UtensilsCrossed",
    subs: [
      ["restaurants", "מסעדות"],
      ["pizza", "פיצה"],
      ["cafes", "בתי קפה"],
      ["bakeries", "מאפיות וקונדיטוריות"],
      ["homemade", "אוכל ביתי"],
      ["catering", "קייטרינג"],
    ],
  },
  {
    slug: "trades",
    name: "בעלי מקצוע",
    icon: "Wrench",
    subs: [
      ["electricians", "חשמלאים"],
      ["plumbers", "אינסטלטורים"],
      ["ac", "מיזוג אוויר"],
      ["handyman", "הנדימן"],
      ["cleaning", "ניקיון"],
      ["pest-control", "הדברה"],
      ["renovations", "שיפוצים"],
    ],
  },
  {
    slug: "beauty",
    name: "טיפוח ויופי",
    icon: "Sparkles",
    subs: [
      ["hair", "מספרות"],
      ["barber", "ברבר"],
      ["nails", "ציפורניים"],
      ["cosmetics", "קוסמטיקה"],
      ["beauty-treatments", "טיפולי יופי"],
    ],
  },
  {
    slug: "kids",
    name: "ילדים וחוגים",
    icon: "Baby",
    subs: [
      ["classes", "חוגים"],
      ["activities", "הפעלות"],
      ["birthdays", "ימי הולדת"],
      ["babysitter", "בייביסיטר"],
      ["kids-lessons", "שיעורים לילדים"],
    ],
  },
  {
    slug: "health",
    name: "בריאות וגוף",
    icon: "HeartPulse",
    subs: [
      ["clinics", "קליניקות"],
      ["physio", "פיזיותרפיה"],
      ["alternative", "רפואה משלימה"],
      ["fitness", "כושר"],
      ["nutrition", "תזונה"],
    ],
  },
  {
    slug: "pets",
    name: "בעלי חיים",
    icon: "PawPrint",
    subs: [
      ["vet", "וטרינר"],
      ["grooming", "מספרת כלבים"],
      ["boarding", "פנסיון"],
      ["training", "אילוף"],
      ["pet-supplies", "מזון וציוד"],
    ],
  },
  {
    slug: "auto",
    name: "רכב",
    icon: "Car",
    subs: [
      ["garage", "מוסכים"],
      ["carwash", "שטיפת רכב"],
      ["bodywork", "פחחות"],
      ["auto-electric", "חשמל רכב"],
      ["towing", "גרירה"],
    ],
  },
  {
    slug: "home",
    name: "לבית ולגינה",
    icon: "House",
    subs: [
      ["gardening", "גינון"],
      ["furniture", "ריהוט"],
      ["moving", "הובלות"],
      ["home-repair", "תיקונים לבית"],
      ["interior", "עיצוב פנים"],
    ],
  },
  {
    slug: "studies",
    name: "לימודים",
    icon: "GraduationCap",
    subs: [
      ["tutoring", "שיעורים פרטיים"],
      ["bagrut", "הכנה לבגרויות"],
      ["english", "אנגלית"],
      ["music-lessons", "מוזיקה"],
      ["computers", "מחשבים"],
    ],
  },
  {
    slug: "events",
    name: "אירועים ופנאי",
    icon: "PartyPopper",
    subs: [
      ["halls", "אולמות"],
      ["photography", "צילום"],
      ["event-music", "מוזיקה לאירועים"],
      ["event-design", "עיצוב אירועים"],
      ["leisure", "פנאי וספורט"],
    ],
  },
  {
    slug: "professional",
    name: "שירותים מקצועיים",
    icon: "Briefcase",
    subs: [
      ["accounting", "הנהלת חשבונות"],
      ["lawyers", "עורכי דין"],
      ["insurance", "ביטוח"],
      ["consulting", "ייעוץ"],
      ["translation", "תרגום"],
    ],
  },
  {
    slug: "shopping",
    name: "קניות",
    icon: "ShoppingBag",
    subs: [
      ["grocery", "מכולת"],
      ["clothing", "בגדים"],
      ["gifts", "מתנות"],
      ["flowers", "פרחים"],
      ["crafts", "יצירה ואומנות"],
    ],
  },
] as const;

const tagDefs = [
  ["delivery", "משלוחים"],
  ["home-business", "עסק ביתי"],
  ["home-service", "מגיעים עד הבית"],
  ["open-friday", "פתוח בשישי"],
  ["accessible", "נגיש"],
  ["by-appointment", "בתיאום מראש"],
  ["emergency", "שירות חירום"],
  ["pickup", "איסוף עצמי"],
  ["kids-friendly", "מתאים לילדים"],
] as const;

type BizInput = {
  name: string;
  slug: string;
  short: string;
  description: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  address?: string;
  showAddress?: boolean;
  pin?: number;
  home?: boolean;
  delivery?: boolean;
  visit?: boolean;
  access?: boolean;
  kosher?: boolean;
  verified?: boolean;
  featured?: boolean;
  createdAt: string;
  cats: Array<[string, string]>;
  tags: string[];
  hours: Array<[number, string, string]>;
  recs?: number;
};

const days = (from: number, to: number, open: string, close: string) => {
  const rows: Array<[number, string, string]> = [];
  for (let day = from; day <= to; day += 1) rows.push([day, open, close]);
  return rows;
};

const businessesInput: BizInput[] = [
  {
    name: "פיצריית הכיכר",
    slug: "pizzeria-hakikar",
    short: "פיצה במגש, משלוחים ואיסוף עצמי בכל עתלית.",
    description:
      "מטבח קטן עם תנור חם ובצק שמכינים כאן כל בוקר. מתאים למשפחה, לערב חברים או למגש שאפשר לאסוף בדרך הביתה. בימי שישי כדאי להזמין מוקדם.",
    phone: "050-000-0101",
    whatsapp: "050-000-0101",
    address: "רחוב הזית 14, עתלית",
    showAddress: true,
    pin: 1,
    delivery: true,
    verified: true,
    featured: true,
    createdAt: "2026-03-15T09:00:00.000Z",
    cats: [["food", "pizza"]],
    tags: ["delivery", "pickup", "open-friday", "kids-friendly"],
    hours: [...days(0, 4, "11:00", "23:00"), [5, "11:00", "15:00"], [6, "18:00", "23:00"]],
    recs: 18,
  },
  {
    name: "קפה מורן",
    slug: "cafe-moran",
    short: "קפה, מאפים ובוקר רגוע במרכז עתלית.",
    description:
      "מקום לשבת עם מחשב, עם הילדים או סתם לחכות למישהו. יש ארוחות בוקר, עוגת יום הולדת להזמנה מראש ופינה נגישה.",
    phone: "050-000-0102",
    whatsapp: "050-000-0102",
    instagram: "https://instagram.com/cafe.moran.demo",
    address: "רחוב הרימון 3, עתלית",
    showAddress: true,
    pin: 2,
    access: true,
    verified: true,
    featured: true,
    createdAt: "2026-04-02T09:00:00.000Z",
    cats: [["food", "cafes"]],
    tags: ["open-friday", "accessible", "kids-friendly", "pickup"],
    hours: [...days(0, 4, "07:30", "19:30"), [5, "07:30", "14:00"], [6, "08:30", "14:30"]],
    recs: 14,
  },
  {
    name: "המטבח של רינה",
    slug: "rina-kitchen",
    short: "אוכל ביתי במגשים ומשלוחים בתוך היישוב.",
    description:
      "תבשילים, סלטים ומגשים לשישי או לאירוח קטן. הכל נעשה בבית, בתיאום מראש, ומגיע עד הדלת בתוך עתלית. אין חנות פתוחה לרחוב.",
    phone: "050-000-0103",
    whatsapp: "050-000-0103",
    home: true,
    delivery: true,
    verified: false,
    featured: true,
    createdAt: "2026-04-22T09:00:00.000Z",
    cats: [
      ["food", "homemade"],
      ["food", "catering"],
    ],
    tags: ["delivery", "home-business", "by-appointment", "open-friday"],
    hours: [...days(0, 4, "10:00", "19:00"), [5, "09:00", "13:00"]],
    recs: 9,
  },
  {
    name: "מאפיית דגן",
    slug: "dagan-bakery",
    short: "לחמים, חלות ועוגות שנאפות כאן כל בוקר.",
    description:
      "מאפייה שכונתית עם לחם מחמצת, חלות לשישי והזמנת עוגת יום הולדת. אפשר לאסוף מהדלפק. המאפייה כשרה.",
    phone: "050-000-0104",
    website: "https://example.com/dagan-bakery",
    address: "שדרות הכלנית 21, עתלית",
    showAddress: true,
    pin: 3,
    kosher: true,
    verified: true,
    createdAt: "2026-05-08T09:00:00.000Z",
    cats: [["food", "bakeries"]],
    tags: ["pickup", "open-friday", "kids-friendly"],
    hours: [...days(0, 4, "06:30", "19:00"), [5, "06:30", "13:00"]],
    recs: 11,
  },
  {
    name: "יוסי — חשמל עד הבית",
    slug: "yossi-electric",
    short: "תיקוני חשמל ותקלות דחופות, מגיעים עד הבית.",
    description:
      "לוחות, שקעים, תאורה ותקלות שצצות באמצע היום. יוסי מגיע לבתים בעתלית, גם לקריאה דחופה. שווה לשלוח הודעה עם תמונה של הלוח.",
    phone: "050-000-0105",
    whatsapp: "050-000-0105",
    visit: true,
    verified: true,
    featured: true,
    createdAt: "2026-05-20T09:00:00.000Z",
    cats: [["trades", "electricians"]],
    tags: ["home-service", "emergency", "open-friday"],
    hours: days(0, 6, "00:00", "23:59"),
    recs: 16,
  },
  {
    name: "אינסטלציית כרמל",
    slug: "carmel-plumbing",
    short: "נזילות, סתימות ודודים — מגיעים עד הבית.",
    description:
      "שירות אינסטלציה לבית: נזילות, ברזים, סתימות ודודים. מתאמים שעה ומגיעים לעתלית. לקריאה דחופה עדיף להתקשר.",
    phone: "050-000-0106",
    whatsapp: "050-000-0106",
    visit: true,
    createdAt: "2026-06-04T09:00:00.000Z",
    cats: [["trades", "plumbers"]],
    tags: ["home-service", "emergency", "open-friday"],
    hours: [...days(0, 4, "07:30", "18:00"), [5, "08:00", "13:00"]],
    recs: 4,
  },
  {
    name: "ניקיון עם ליאת",
    slug: "liat-cleaning",
    short: "ניקיון יסודי לבתים ולדירות נופש, בתיאום מראש.",
    description:
      "ליאת מגיעה עם הציוד, עובדת לבד או עם עוד זוג ידיים, ומתאימה את הביקור לבית. מתאים לפני אירוח או אחרי שיפוץ קטן.",
    phone: "050-000-0107",
    whatsapp: "050-000-0107",
    home: true,
    visit: true,
    createdAt: "2026-06-12T09:00:00.000Z",
    cats: [["trades", "cleaning"]],
    tags: ["home-business", "home-service", "by-appointment"],
    hours: days(0, 4, "08:00", "16:00"),
    recs: 6,
  },
  {
    name: "הדברה שקטה",
    slug: "quiet-pest",
    short: "הדברה לבית ולגינה, בלי רעש מיותר.",
    description:
      "טיפול בנמלים, תיקנים ומזיקים בגינה. מגיעים עד הבית, מסבירים מה עושים לפני הריסוס, ומשאירים הנחיות ברורות אחרי הביקור.",
    phone: "050-000-0108",
    visit: true,
    createdAt: "2026-06-20T09:00:00.000Z",
    cats: [["trades", "pest-control"]],
    tags: ["home-service", "by-appointment", "open-friday"],
    hours: [...days(0, 4, "08:00", "17:00"), [5, "08:00", "12:00"]],
    recs: 2,
  },
  {
    name: "מספרת אור",
    slug: "or-salon",
    short: "תספורות, צבע וטיפוח לנשים, גברים וילדים.",
    description:
      "מספרה נעימה עם תורים מסודרים, גם לילדים אחרי בית הספר. יש גישה נוחה והמקום פתוח בשישי בבוקר. מומלץ לקבוע מראש לצבע.",
    phone: "050-000-0109",
    whatsapp: "050-000-0109",
    instagram: "https://instagram.com/or.salon.demo",
    address: "רחוב התאנה 8, עתלית",
    showAddress: true,
    pin: 4,
    access: true,
    verified: true,
    featured: true,
    createdAt: "2026-06-28T09:00:00.000Z",
    cats: [["beauty", "hair"]],
    tags: ["by-appointment", "accessible", "open-friday", "kids-friendly"],
    hours: [
      ...days(0, 2, "09:00", "19:00"),
      [3, "09:00", "13:00"],
      [3, "16:00", "20:00"],
      [4, "09:00", "19:00"],
      [5, "08:00", "14:00"],
    ],
    recs: 12,
  },
  {
    name: "ברבר דניאל",
    slug: "daniel-barber",
    short: "תספורת גברים וזקן, בלי תור ארוך.",
    description:
      "כיסא אחד, עבודה מדויקת, ומוזיקה שקטה. אפשר להגיע בלי תור ברוב הימים, אבל ביום חמישי עדיף לשלוח הודעה קודם.",
    phone: "050-000-0110",
    whatsapp: "050-000-0110",
    address: "רחוב השקד 5, עתלית",
    showAddress: true,
    pin: 5,
    createdAt: "2026-07-05T09:00:00.000Z",
    cats: [["beauty", "barber"]],
    tags: ["open-friday"],
    hours: [...days(0, 4, "10:00", "20:00"), [5, "09:00", "14:00"]],
    recs: 5,
  },
  {
    name: "חוג הכדורגל השכונתי",
    slug: "atlit-football",
    short: "חוג לילדים בגילאי 6–12, שלוש פעמים בשבוע.",
    description:
      "אימון קליל במגרש הקהילתי, עם דגש על כיף, תיאום ומשחק קבוצתי. ההרשמה לתקופה, והאימונים מתקיימים אחה״צ.",
    phone: "050-000-0111",
    whatsapp: "050-000-0111",
    address: "מגרש קהילתי, עתלית",
    showAddress: true,
    pin: 6,
    verified: true,
    createdAt: "2026-07-12T09:00:00.000Z",
    cats: [
      ["kids", "classes"],
      ["kids", "kids-lessons"],
    ],
    tags: ["kids-friendly", "by-appointment"],
    hours: [
      [0, "16:30", "18:30"],
      [2, "16:30", "18:30"],
      [4, "16:30", "18:30"],
    ],
    recs: 7,
  },
  {
    name: "ימי הולדת עם נועם",
    slug: "noam-birthdays",
    short: "הפעלות ויום הולדת עד הבית, בתיאום מראש.",
    description:
      "שעה של משחק, בלונים והפעלה שמתאימה לגיל. נועם מגיע אל הבית או אל הגינה, ומביא איתו את הציוד. מתאים גם לאירוע קטן של חברים.",
    phone: "050-000-0112",
    whatsapp: "050-000-0112",
    visit: true,
    featured: true,
    createdAt: "2026-07-20T09:00:00.000Z",
    cats: [
      ["kids", "birthdays"],
      ["events", "event-design"],
    ],
    tags: ["home-service", "kids-friendly", "by-appointment", "open-friday"],
    hours: days(0, 5, "09:00", "19:00"),
    recs: 8,
  },
  {
    name: "בייביסיטר מיכל",
    slug: "michal-sitter",
    short: "שמירה על ילדים אחרי הצהריים ובערבים.",
    description:
      "מיכל שומרת על ילדים בעתלית, אחרי היכרות קצרה עם ההורים. זמינה בעיקר אחה״צ ובערבי חול, ובשישי בבוקר.",
    phone: "050-000-0113",
    whatsapp: "050-000-0113",
    home: true,
    visit: true,
    createdAt: "2026-07-28T09:00:00.000Z",
    cats: [["kids", "babysitter"]],
    tags: ["home-business", "home-service", "kids-friendly", "by-appointment", "open-friday"],
    hours: [...days(0, 4, "15:00", "21:00"), [5, "08:00", "13:00"]],
    recs: 3,
  },
  {
    name: "קליניקת תנועה",
    slug: "tnuva-clinic",
    short: "פיזיותרפיה ושיקום, באווירה שקטה.",
    description:
      "טיפול פרטני בכאבי גב, אחרי פציעה או כשפשוט קשה לזוז כמו פעם. הקליניקה נגישה, והתורים נקבעים מראש.",
    phone: "050-000-0114",
    email: "move@example.com",
    address: "רחוב החרוב 11, עתלית",
    showAddress: true,
    pin: 7,
    access: true,
    verified: true,
    createdAt: "2026-08-04T09:00:00.000Z",
    cats: [
      ["health", "physio"],
      ["health", "clinics"],
    ],
    tags: ["accessible", "by-appointment", "open-friday"],
    hours: [...days(0, 4, "08:00", "19:00"), [5, "08:00", "12:30"]],
    recs: 6,
  },
  {
    name: "המרפאה של ד״ר בר",
    slug: "dr-bar-vet",
    short: "וטרינר לכלבים ולחתולים, כולל חיסונים.",
    description:
      "מרפאה קטנה לחיות מחמד: בדיקות, חיסונים וטיפול שוטף. אם צריך, משאירים הודעה וחוזרים עם שעה פנויה באותו יום.",
    phone: "050-000-0115",
    whatsapp: "050-000-0115",
    email: "vet@example.com",
    address: "רחוב הגפן 2, עתלית",
    showAddress: true,
    pin: 8,
    verified: true,
    featured: true,
    createdAt: "2026-08-11T09:00:00.000Z",
    cats: [["pets", "vet"]],
    tags: ["open-friday", "by-appointment"],
    hours: [...days(0, 4, "09:00", "19:00"), [5, "09:00", "13:00"]],
    recs: 10,
  },
  {
    name: "מוסך הכרמל הצעיר",
    slug: "carmel-garage",
    short: "טיפולים שוטפים, בלמים ודיאגנוסטיקה.",
    description:
      "מוסך שכונתי לטיפול תקופתי, בלמים ובדיקה לפני טסט. עובדים בשקיפות ומסבירים מה כדאי לדחות ומה לא.",
    phone: "050-000-0116",
    address: "רחוב הדקל 19, עתלית",
    showAddress: true,
    pin: 9,
    createdAt: "2026-08-18T09:00:00.000Z",
    cats: [["auto", "garage"]],
    tags: ["open-friday"],
    hours: [...days(0, 4, "08:00", "17:00"), [5, "08:00", "13:00"]],
    recs: 3,
  },
  {
    name: "גינות עתלית",
    slug: "atlit-gardens",
    short: "גיזום, הקמה ותחזוקה של גינות פרטיות.",
    description:
      "צוות קטן שמגיע לגינה: גיזום, השקיה, הכנת אדמה ושתילה. אפשר ביקור חד־פעמי או סיבוב קבוע פעם בחודש.",
    phone: "050-000-0117",
    whatsapp: "050-000-0117",
    visit: true,
    createdAt: "2026-08-26T09:00:00.000Z",
    cats: [["home", "gardening"]],
    tags: ["home-service", "open-friday"],
    hours: [...days(0, 4, "07:00", "16:00"), [5, "07:00", "12:00"]],
    recs: 4,
  },
  {
    name: "שיעורים עם יעל",
    slug: "yael-lessons",
    short: "מתמטיקה ואנגלית, בבית או אצלכם.",
    description:
      "שיעורים פרטיים לתלמידי יסודי וחטיבה, כולל חזרה למבחן והכנה לבגרות ראשונה. יעל מגיעה הביתה או מארחת אצלה, בתיאום.",
    phone: "050-000-0118",
    whatsapp: "050-000-0118",
    home: true,
    visit: true,
    createdAt: "2026-09-02T09:00:00.000Z",
    cats: [
      ["studies", "tutoring"],
      ["studies", "bagrut"],
    ],
    tags: ["home-business", "home-service", "by-appointment", "kids-friendly"],
    hours: days(0, 4, "14:00", "20:00"),
    recs: 5,
  },
  {
    name: "רונית — הנהלת חשבונות",
    slug: "ronit-books",
    short: "ליווי לעצמאים ולעסקים קטנים בעתלית.",
    description:
      "הנהלת חשבונות, מע״מ וסדר במסמכים לעסק קטן. הפגישות בתיאום, בלי משרד פתוח למעבר. מתאים למי שפותח עסק ביישוב.",
    phone: "050-000-0119",
    email: "books@example.com",
    home: true,
    verified: true,
    createdAt: "2026-09-10T09:00:00.000Z",
    cats: [["professional", "accounting"]],
    tags: ["home-business", "by-appointment", "open-friday"],
    hours: [...days(0, 4, "09:00", "17:00"), [5, "09:00", "13:00"]],
    recs: 4,
  },
  {
    name: "חנות המתנות נור",
    slug: "nor-gifts",
    short: "מתנות קטנות, כרטיסי ברכה ואריזות.",
    description:
      "חנות קטנה למתנה של הרגע האחרון: מחברות, נרות, כרטיסים ואריזה יפה. מתאים גם לפני יום הולדת של ילדים.",
    phone: "050-000-0120",
    facebook: "https://facebook.com/nor.gifts.demo",
    address: "רחוב האורן 27, עתלית",
    showAddress: true,
    pin: 10,
    verified: true,
    createdAt: "2026-09-18T09:00:00.000Z",
    cats: [["shopping", "gifts"]],
    tags: ["open-friday", "kids-friendly"],
    hours: [...days(0, 4, "10:00", "19:00"), [5, "09:00", "14:00"]],
    recs: 6,
  },
];

function pinFor(index: number) {
  return {
    latitude: Number((32.681 + ((index * 3) % 7) * 0.0017).toFixed(6)),
    longitude: Number((34.933 + ((index * 5) % 6) * 0.0019).toFixed(6)),
  };
}

export function createSeedStore(): CatalogStore {
  const categories: Category[] = categoryDefs.map((category, index) => ({
    id: uid(101 + index),
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    displayOrder: index + 1,
    isActive: true,
    createdAt: NOW,
  }));
  const subcategories: Subcategory[] = [];
  let subNumber = 201;
  const subBySlug = new Map<string, Subcategory>();
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  categoryDefs.forEach((category, categoryIndex) => {
    category.subs.forEach(([slug, name], index) => {
      const item: Subcategory = {
        id: uid(subNumber),
        categoryId: uid(101 + categoryIndex),
        name,
        slug,
        displayOrder: index + 1,
        isActive: true,
      };
      subNumber += 1;
      subcategories.push(item);
      subBySlug.set(slug, item);
    });
  });
  const tags: Tag[] = tagDefs.map(([slug, name], index) => ({
    id: uid(301 + index),
    name,
    slug,
  }));
  const tagBySlug = new Map(tags.map((tag) => [tag.slug, tag]));

  const businesses: Business[] = [];
  const categoryLinks: CategoryLink[] = [];
  const businessTags: CatalogStore["businessTags"] = [];
  const hours: BusinessHour[] = [];
  const images: BusinessImage[] = [];
  const recommendations: Recommendation[] = [];
  let hourNumber = 5000;
  let imageNumber = 7000;
  let recNumber = 9000;

  businessesInput.forEach((input, index) => {
    const id = uid(401 + index);
    const coords = input.showAddress && input.pin ? pinFor(input.pin) : { latitude: null, longitude: null };
    businesses.push({
      id,
      localityId: LOCALITY_ID,
      name: input.name,
      slug: input.slug,
      shortDescription: input.short,
      description: input.description,
      phone: input.phone,
      whatsapp: input.whatsapp ?? null,
      email: input.email ?? null,
      website: input.website ?? null,
      instagram: input.instagram ?? null,
      facebook: input.facebook ?? null,
      address: input.showAddress ? (input.address ?? null) : null,
      latitude: coords.latitude,
      longitude: coords.longitude,
      showExactAddress: Boolean(input.showAddress),
      logoUrl: null,
      coverImageUrl: null,
      isHomeBusiness: Boolean(input.home),
      providesDelivery: Boolean(input.delivery),
      providesHomeService: Boolean(input.visit),
      accessibility: Boolean(input.access),
      kosher: Boolean(input.kosher),
      verified: Boolean(input.verified),
      active: true,
      featured: Boolean(input.featured),
      isDemo: true,
      createdAt: input.createdAt,
      updatedAt: input.createdAt,
    });
    input.cats.forEach(([categorySlug, subSlug]) => {
      const category = categoryBySlug.get(categorySlug);
      const subcategory = subBySlug.get(subSlug);
      if (!category || !subcategory) {
        throw new Error(`Unknown category link ${categorySlug}/${subSlug}`);
      }
      categoryLinks.push({ businessId: id, categoryId: category.id, subcategoryId: subcategory.id });
    });
    input.tags.forEach((slug) => {
      const tag = tagBySlug.get(slug);
      if (!tag) throw new Error(`Unknown tag ${slug}`);
      businessTags.push({ businessId: id, tagId: tag.id });
    });
    input.hours.forEach(([day, openTime, closeTime]) => {
      hours.push({
        id: uid(hourNumber),
        businessId: id,
        dayOfWeek: day as DayOfWeek,
        openTime,
        closeTime,
      });
      hourNumber += 1;
    });
    [1, 2, 3].forEach((order) => {
      images.push({
        id: uid(imageNumber),
        businessId: id,
        imageUrl: `gradient:${order}`,
        altText: `המחשה של ${input.name}`,
        displayOrder: order,
      });
      imageNumber += 1;
    });
    for (let rec = 0; rec < (input.recs ?? 0); rec += 1) {
      recommendations.push({
        id: uid(recNumber),
        businessId: id,
        residentKey: `seed-${input.slug}-${rec + 1}`,
        createdAt: input.createdAt,
      });
      recNumber += 1;
    }
  });

  const shopping = categoryBySlug.get("shopping");
  const crafts = subBySlug.get("crafts");
  const barber = businesses.find((business) => business.slug === "daniel-barber");
  const garage = businesses.find((business) => business.slug === "carmel-garage");
  if (!shopping || !crafts || !barber || !garage) throw new Error("Seed references missing");

  const store: CatalogStore = {
    version: SEED_VERSION,
    localities: [
      {
        id: LOCALITY_ID,
        name: "עתלית",
        slug: "atlit",
        isPrimary: true,
        isActive: true,
        createdAt: NOW,
      },
    ],
    categories,
    subcategories,
    tags,
    businesses,
    categoryLinks,
    businessTags,
    hours,
    images,
    recommendations,
    submissions: [
      {
        id: uid(11001),
        businessName: "סטודיו קרמיקה דנה",
        categoryId: shopping.id,
        subcategoryId: crafts.id,
        description: "סדנאות קרמיקה קטנות בבית, לקבוצות של עד שמונה. זו פנייה לדוגמה שמחכה לבדיקה.",
        phone: "050-000-0191",
        whatsapp: "050-000-0191",
        contactPerson: "דנה לוי",
        imageUrl: null,
        status: "pending",
        reviewerNote: null,
        createdBusinessId: null,
        createdAt: "2026-09-21T10:00:00.000Z",
      },
    ],
    claims: [
      {
        id: uid(12001),
        businessId: barber.id,
        claimantName: "דניאל פרץ",
        phone: "050-000-0192",
        email: "owner@example.com",
        message: "אני מפעיל את הברבר ומבקש לעדכן שעות וטלפון. זו בקשת הדגמה.",
        claimantUserId: null,
        status: "pending",
        reviewerNote: null,
        createdAt: "2026-09-21T11:00:00.000Z",
      },
    ],
    reports: [
      {
        id: uid(13001),
        businessId: garage.id,
        reason: "incorrect_hours",
        details: "ביום שישי נסגרים ב־12:00, לא ב־13:00. דיווח הדגמה.",
        contact: "050-000-0193",
        status: "pending",
        createdAt: "2026-09-21T12:00:00.000Z",
      },
    ],
    owners: [],
  };

  return store;
}
