// src/data/testimonials.ts
export type TestimonialPlatform =
  | "facebook"
  | "whatsapp"
  | "google"
  | "website"
  | "phone"; // Add more as needed
export type TestimonialProductCategory = "All" | "Bed-Bugs" | "Crawling-Insects" | "General";

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  avatarUrl?: string;
  testimonial: string;
  rating?: number;
  date?: string;
  productUsed?: string;
  platform?: TestimonialPlatform; // New field for the source platform
  category?: TestimonialProductCategory; // Add this line
}

// Updated Example Testimonial Data
export const exampleTestimonials: Testimonial[] = [
  // --- آراء العملاء الجديدة ---
  {
    id: "1",
    name: "چيهان صلاح العفيفي",
    location: "التجمع الخامس",
    testimonial:
      "هو بصراحه انتم من انضف الشركات اللى ممكن حد يتعامل معاها مش بس منتجات محترمه و فعاله ..لا و فريق عمل اكثر من محترم..اتشرفت بالتعامل معكم",
    rating: 5,
    date: "2020-05-10",
    productUsed: "مبيد الصراصير المركز",
    platform: "facebook",
    category:"General"
  },
  {
    id: "2",
    name: "امانى السيد",
    location: "شبرا الخيمة",
    testimonial:
      "انا اسفه جدا على سوء الظن الي حصل مني بس بجد والله المنتج فظيع وهم والله البق مشاء الله اختفى ولو لقيت بتلقيها دايخه هههه وممكن يلاقي ميت من غير ما المسو. انا اسفه انا شكيت في المنتج",
    rating: 5,
    date: "2025-05-17", // Defaulted to current date
    productUsed: "مبيد البق المركز",
    platform: "whatsapp",
    category:"Bed-Bugs"
  },
  {
    id: "3",
    name: "مروه السيد",
    location: "القاهرة - غمرة",
    testimonial:
      "بصراحة، بجد ما شاء الله، رش البق طلع جميل جداً جداً جداً، ومهما وصفت فيه مش هقدر أوفي الشركة حقها. والله فعلاً جاب نتيجة وخلصنا من الوباء ده، والفضل بعد ربنا في الرش بتاعكم. جربنا منتجات كتير جداً وأغلى كمان، وهو ده اللي جاب من الآخر. تعبتكم معايا جداً بالأسئلة، وكنت أول مرة أطلب حاجة من النت، بس بجد ربنا يبارك فيكم وفي شركتكم. كنتم معايا خطوة بخطوة ومهتمين للآخر. شكراً جداً، وبجد مش آخر تعامل معاكم. شركة محترمة ومنتج محترم ويستاهل.",
    rating: 5,
    date: "2025-05-17", // Defaulted to current date
    productUsed: "مبيد البق المركز",
    platform: "whatsapp",
    category:"Bed-Bugs"

  },
  {
    id: "4",
    name: "Shosho Rezk",
    location: "الجيزه",
    testimonial:
      "منتجاتهم جميلة جدا ماشاء الله بتقضي علي الحشرة مهما كانت ❤️🥰",
    rating: 5,
    date: "2025-05-17", // Defaulted to current date
    productUsed: "مبيد النمل المركز",
    platform: "facebook",
    category:"Crawling-Insects"

  },
  {
    id: "5",
    name: "ghada elmasry",
    location: "الجيزه الشيخ زايد",
    testimonial:
      "ان جربت منجاتكم من حوالي ٣ سنين بس كان صراصير ونمل وفعلا النتيجه كانت روعه",
    rating: 5,
    // date: undefined, // "من حوالي ٣ سنين"
    productUsed: "مبيد الصراصير و النمل المركز",
    platform: "facebook", // Assumed based on image context
    category:"Crawling-Insects"
  },
  {
    id: "6",
    name: "Engy Khalil Mohamed",
    // location: undefined,
    testimonial:
      "بجد مش عارفه اشكركو ازاي. انا فعلا كنت بدأت افقد الامل. شكرا جدا جدا منتج فعال واسبوع وهرش تاني علشان اتاكد انه خلاص مفيش اي حاجه",
    rating: 5,
    date: "2025-04-01", // Defaulted to first day of April 2025
    productUsed: "بيد جارد 20 %",
    platform: "facebook",
    category:"Bed-Bugs"
  },
  {
    id: "7",
    name: "Maha Zein",
    // location: undefined,
    testimonial:
      "على فكره انا كنت خايفه منه لانى حسيت انه زى المايه لكن بصراحه ممتاز انا مش لاقيه صراصير اصلا ولا صاحيه ولا ميته مش عارفه ازاى تسلم ايديكوا ❤️",
    rating: 5,
    date: "2023-08-05",
    productUsed: "مالتى جارد 20%",
    platform: "facebook",
    category:"Crawling-Insects"
  },
  {
    id: "8",
    name: "مها احمد",
    // location: undefined,
    testimonial:
      "انا استخدمت من حضرتكم المركز وكان جميل أوي وفعال ماشاء الله. طلع جميل أوي للذباب والصراصير والنمل واي حشره والله حتي البرص موته",
    rating: 5,
    date: "2025-03-14",
    productUsed: "بيد جارد المركز",
    platform: "facebook",
    category:"Bed-Bugs"
  },
  {
    id: "9",
    name: "Ghadr Al Ahbab",
    // location: undefined,
    testimonial:
      "رش البق ممتاز وربنا روعة من اول رشه مبقاش القي حاجه. انا كده رشيت الرشه التانيه بعد 8 ايام عادي بس هو الحمدلله مبقاش اشوف حاجه",
    rating: 5,
    date: "2023-10-23",
    productUsed: "بيد جارد المركز", // Assumed for "رش البق"
    platform: "facebook",
    category:"Bed-Bugs"
  },
  // --- آراء العملاء الأصلية ---
  {
    id: "10",
    name: "أحمد محمود",
    location: "القاهرة",
    avatarUrl: "/imgs/avatars/ahmed.jpg",
    testimonial:
      "منتج بيد جارد كان ممتاز! قضى على بق الفراش بسرعة وأمان. شكرًا بيلا إيجيبت!",
    rating: 5,
    date: "2024-04-15",
    productUsed: "بيد جارد 20%",
    platform: "facebook",
  },
  {
    id: "11",
    name: "فاطمة علي",
    location: "الجيزة",
    testimonial:
      "استخدمت مالتي جارد للصراصير والحمدلله اختفت المشكلة. خدمة عملاء رائعة ومنتج فعال.",
    rating: 4,
    date: "2024-03-22",
    productUsed: "مالتي جارد 20%",
    platform: "whatsapp",
    category:"Crawling-Insects"
  },
  {
    id: "12",
    name: "محمد حسين",
    testimonial:
      "أفضل مبيدات حشرية استخدمتها على الإطلاق. بدون رائحة وآمنة على الأطفال.",
    rating: 5,
    platform: "google",
    category:"General"
  },
  {
    id: "13",
    name: "سارة إبراهيم",
    testimonial:
      "العلبة المركزة فعلاً موفرة وبتكفي كتير. الشرح لطريقة التخفيف كان واضح جداً مع الأدوات المرسلة. الشحن كان سريع.",
    rating: 5,
    date: "2025-05-01",
    productUsed: "العبوة المركزة (بيد جارد)",
    platform: "phone",
    category:"Bed-Bugs"
  },
  {
    id: "14",
    name: "خالد عبد الرحمن",
    testimonial:
      "طلبت عرض الرشتين وكان ممتاز! الشحن وصل مجاني والتعامل كان احترافي. أنصح به بشدة.",
    rating: 5,
    date: "2025-04-20",
    productUsed: "عرض الرشتين (مالتي جارد)",
    platform: "website",
    category:"Crawling-Insects"
  },
];
export const getTestimonials = async (
  category?: TestimonialProductCategory,
  limit?: number
): Promise<Testimonial[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = exampleTestimonials;

  if (category && category !== "All") {
    filtered = exampleTestimonials.filter(t => t.category === category);
  }
  
  if (limit) {
    return filtered.slice(0, limit);
  }
  return filtered;
};