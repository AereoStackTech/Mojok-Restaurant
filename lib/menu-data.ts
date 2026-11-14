import type { CategoryId, LocalizedText, MenuItem } from './types';

import bistroHeroImg from '@/src/assets/images/bistro_hero_1794676234766.jpg';
import couscousRoyalImg from '@/src/assets/images/couscous_royal_1794676235748.jpg';
import moroccanRfissaImg from '@/src/assets/images/moroccan_rfissa_1794676236015.jpg';
import specialtyLatteImg from '@/src/assets/images/specialty_latte_1794676238324.jpg';
import woodfiredPizzaImg from '@/src/assets/images/woodfired_pizza_1794676237080.jpg';
import atlanticSeabassImg from '@/src/assets/images/atlantic_seabass_1794676236648.jpg';
import gourmetBurgerImg from '@/src/assets/images/gourmet_burger_1794676237611.jpg';
import freshPastaImg from '@/src/assets/images/fresh_pasta_1794676237316.jpg';
import gourmetTacosImg from '@/src/assets/images/gourmet_tacos_1794676238471.jpg';

export const BISTRO_HERO_IMAGE = bistroHeroImg;

export const CATEGORIES: { id: CategoryId; label: LocalizedText }[] = [
  { id: 'all', label: { fr: 'Toute la carte', ar: 'كل القائمة' } },
  { id: 'daily-specials', label: { fr: 'Plats du Jour', ar: 'أطباق اليوم' } },
  { id: 'coffee-morning', label: { fr: 'Café & Matin', ar: 'القهوة والفطور' } },
  { id: 'pizzas-pasta', label: { fr: 'Pizzas & Pâtes', ar: 'البيتزا والمعكرونة' } },
  { id: 'seafood-grill', label: { fr: 'Mer & Grill', ar: 'أطباق البحر والمشويات' } },
  { id: 'burgers-tacos', label: { fr: 'Burgers & Tacos', ar: 'البرغر والتاكوس' } },
  { id: 'desserts-drinks', label: { fr: 'Desserts & Boissons', ar: 'الحلويات والمشروبات' } },
];

export const PICKUP_TIME_SLOTS: { id: string; label: LocalizedText }[] = [
  { id: 'asap', label: { fr: 'Dès que possible (15–20 min)', ar: 'في أقرب وقت (15–20 د)' } },
  { id: '12:30', label: { fr: '12:30 · Service Midi', ar: '12:30 · غداء' } },
  { id: '13:00', label: { fr: '13:00 · Pause Bureau', ar: '13:00 · استراحة العمل' } },
  { id: '13:30', label: { fr: '13:30 · Déjeuner', ar: '13:30 · غداء' } },
  { id: '19:30', label: { fr: '19:30 · Dîner', ar: '19:30 · عشاء' } },
  { id: '20:30', label: { fr: '20:30 · Soirée', ar: '20:30 · مساءً' } },
];

export const NEIGHBORHOODS: { id: string; label: LocalizedText; feeMad: number }[] = [
  { id: 'centre-ville', label: { fr: 'Centre-Ville & Boulevard', ar: 'وسط المدينة والشارع الرئيسي' }, feeMad: 10 },
  { id: 'plateau', label: { fr: 'Quartier Plateau & Bureaux', ar: 'حي البلاطو والمكاتب' }, feeMad: 10 },
  { id: 'corniche', label: { fr: 'Corniche & Front de Mer', ar: 'الكورنيش والواجهة البحرية' }, feeMad: 15 },
  { id: 'salam', label: { fr: 'Hay Salam & Université', ar: 'حي السلام والجامعة' }, feeMad: 15 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'couscous-royal-vendredi',
    slug: 'couscous-royal-vendredi',
    category: 'daily-specials',
    name: {
      fr: 'Couscous Royal Tfaya du Vendredi',
      ar: 'كسكس ملكي بالتفاية (طبق الجمعة)',
    },
    shortDesc: {
      fr: 'Semoule fine roulée à la main, souricette d’agneau confite, oignons caramélisés aux raisins et sept légumes.',
      ar: 'سميد مفتول يدوياً، لحم غنم مطهو ببطء، تفاية البصل والزبيب المعسل مع سبع خضار موسمية.',
    },
    fullDesc: {
      fr: 'Préparé chaque vendredi matin selon la tradition familiale : semoule trois cuissons au beurre beldi, épaule et jarret d’agneau mijotés au safran, pois chiches fondants, courge rouge et tfaya parfumée à la cannelle.',
      ar: 'يُحضّر كل صباح جمعة على الطريقة التقليدية الأصيلة: سميد مبخر بالسمن البلدي، لحم غنم متبل بالزعفران الحر، حمص، قرع أحمر، وتفاية بالقرفة والزبيب.',
    },
    basePriceMad: 95,
    prepMinutes: 18,
    image: couscousRoyalImg,
    isDailySpecial: true,
    specialDay: { fr: 'Spécial Vendredi', ar: 'طبق الجمعة' },
    dietaryTag: { fr: 'Fait maison', ar: 'تحضير منزلي' },
    portions: [
      { id: 'individual', label: { fr: 'Portion Individuelle', ar: 'حصة فردية' }, priceDelta: 0 },
      { id: 'sharing', label: { fr: 'Duo / Partage (2 pers.)', ar: 'حصة ثنائية (شخصان)' }, priceDelta: 75 },
    ],
    addons: [
      { id: 'extra-tfaya', label: { fr: 'Supplément Tfaya & Amandes', ar: 'إضافة تفاية ولوز مقلي' }, price: 14 },
      { id: 'leben-frais', label: { fr: 'Grand verre de Lben frais', ar: 'كأس لبن بلدي بارد' }, price: 12 },
      { id: 'harissa-maison', label: { fr: 'Sauce Harissa & Bouillon extra', ar: 'هريسة منزلية ومرق إضافي' }, price: 6 },
    ],
  },
  {
    id: 'rfissa-poulet-beldi',
    slug: 'rfissa-poulet-beldi',
    category: 'daily-specials',
    name: {
      fr: 'Rfissa Traditionnelle au Poulet Beldi',
      ar: 'رفيسة تقليدية بالدجاج البلدي',
    },
    shortDesc: {
      fr: 'Msemen feuilleté effiloché, poulet fermier mijoté au ras el hanout, lentilles beldi et bouillon au safran.',
      ar: 'تريد مسمن مورق، دجاج بلدي مطهو برأس الحانوت والزعفران، عدس بلدي وحلبة.',
    },
    fullDesc: {
      fr: 'Notre grand classique du mercredi et du week-end : crêpes msemen cuites sur pierre, effilochées à la main et nappées d’un bouillon riche au poulet fermier, lentilles, fenugrec doux et amandes grillées.',
      ar: 'طبقنا المميز لمنتصف الأسبوع وعطلة نهاية الأسبوع: مسمن رقيق محضر على الصاج مع مرق الدجاج البلدي الغني، عدس، حلبة خفيفة، ولوز محمص.',
    },
    basePriceMad: 88,
    prepMinutes: 16,
    image: moroccanRfissaImg,
    isDailySpecial: true,
    specialDay: { fr: 'Mercredi & Week-end', ar: 'الأربعاء ونهاية الأسبوع' },
    dietaryTag: { fr: 'Recette authentique', ar: 'وصفة أصيلة' },
    portions: [
      { id: 'individual', label: { fr: 'Portion Classique', ar: 'حصة عادية' }, priceDelta: 0 },
      { id: 'generous', label: { fr: 'Grande Portion', ar: 'حصة كبيرة' }, priceDelta: 24 },
    ],
    addons: [
      { id: 'hard-egg', label: { fr: 'Œufs fermiers & Dattes farcies', ar: 'بيض بلدي وتمور معمرة' }, price: 14 },
      { id: 'extra-broth', label: { fr: 'Bol de bouillon chaud à part', ar: 'زلافة مرق ساخن جانبي' }, price: 8 },
    ],
  },
  {
    id: 'flat-white-matin-atlas',
    slug: 'flat-white-matin-atlas',
    category: 'coffee-morning',
    name: {
      fr: 'Formule Matin · Flat White & Croissant',
      ar: 'فطور الصباح · فلات وايت وكرواسون',
    },
    shortDesc: {
      fr: 'Double espresso torréfaction artisanale, lait velouté, croissant au beurre et jus d’orange pressé.',
      ar: 'إسبريسو مزدوج محمص بعناية مع حليب مخملي، كرواسون بالزبدة وعصير برتقال طازج.',
    },
    fullDesc: {
      fr: 'Café de spécialité 100% Arabica moulu à la commande, servi avec notre viennoiserie feuilletée du matin et un jus d’oranges de saison pressé minute.',
      ar: 'قهوة مختصة 100% أرابيكا مطحونة عند الطلب، تقدم مع كرواسون طازج بالزبدة الصافية وعصير برتقال طبيعي معصور للتو.',
    },
    basePriceMad: 48,
    prepMinutes: 6,
    image: specialtyLatteImg,
    isTableQuickReorder: true,
    dietaryTag: { fr: 'Torréfaction fraîche', ar: 'تحميص طازج' },
    portions: [
      { id: 'solo-coffee', label: { fr: 'Café Flat White seul', ar: 'فلات وايت فقط' }, priceDelta: -20 },
      { id: 'formule-complete', label: { fr: 'Formule Complète + Jus', ar: 'فطور كامل مع العصير' }, priceDelta: 0 },
    ],
    addons: [
      { id: 'oat-milk', label: { fr: 'Lait d’avoine barista', ar: 'حليب الشوفان' }, price: 8 },
      { id: 'extra-shot', label: { fr: 'Double shot Espresso extra', ar: 'جرعة إسبريسو إضافية' }, price: 10 },
      { id: 'almond-croissant', label: { fr: 'Option Croissant aux amandes', ar: 'ترقية إلى كرواسون باللوز' }, price: 7 },
    ],
  },
  {
    id: 'pizza-burrata-feu-bois',
    slug: 'pizza-burrata-feu-bois',
    category: 'pizzas-pasta',
    name: {
      fr: 'Pizza Feu de Bois · Burrata & Tomates Confites',
      ar: 'بيتزا على الحطب · بوراتا وطماطم كرزية',
    },
    shortDesc: {
      fr: 'Pâte maturée 48h cuite au feu de bois, sauce San Marzano, burrata crémeuse et basilic frais.',
      ar: 'عجينة مخمرة 48 ساعة مخبوزة على الحطب، صلصة طماطم، جبنة بوراتا كريمية وريحان طازج.',
    },
    fullDesc: {
      fr: 'Pâte napolitaine légère à fermentation lente, cuite à 450°C sur pierre, garnie après cuisson d’une burrata fraîche des Pouilles, tomates cerises rôties et huile d’olive vierge.',
      ar: 'عجينة نابوليتانية خفيفة بتخمير بطيء مخبوزة على حرارة عالية، تُزين بجبنة البوراتا الطازجة، الطماطم الكرزية المشوية وزيت الزيتون البكر.',
    },
    basePriceMad: 89,
    prepMinutes: 14,
    image: woodfiredPizzaImg,
    dietaryTag: { fr: 'Végétarien', ar: 'نباتي' },
    portions: [
      { id: 'standard-30cm', label: { fr: 'Classique 30 cm', ar: 'حجم كلاسيكي 30 سم' }, priceDelta: 0 },
      { id: 'large-34cm', label: { fr: 'Grande 34 cm', ar: 'حجم كبير 34 سم' }, priceDelta: 22 },
    ],
    addons: [
      { id: 'truffle-oil', label: { fr: 'Huile à la truffe noire', ar: 'زيت الكمأة السوداء' }, price: 15 },
      { id: 'bresaola', label: { fr: 'Tranches de bœuf séché halal', ar: 'شرائح لحم بقري مجفف' }, price: 24 },
      { id: 'spicy-chili-oil', label: { fr: 'Huile pimentée maison', ar: 'زيت حار منزلي' }, price: 0 },
    ],
  },
  {
    id: 'tagliatelles-champignons-truffe',
    slug: 'tagliatelles-champignons-truffe',
    category: 'pizzas-pasta',
    name: {
      fr: 'Tagliatelles Fraîches aux Champignons & Parmesan',
      ar: 'تاليياتيلي طازجة بالفطر والبارميزان',
    },
    shortDesc: {
      fr: 'Pâtes fraîches artisanales, poêlée de champignons forestiers, crème au thym et copeaux de parmesan.',
      ar: 'معكرونة طازجة محضرة يومياً مع الفطر البري، صلصة الزعتر الكريمية ورقائق البارميزان.',
    },
    fullDesc: {
      fr: 'Tagliatelles laminées sur place chaque matin, saisies avec des champignons frais, ail confit, thym citronné et parmesan affiné 24 mois.',
      ar: 'معكرونة تاليياتيلي طازجة تُحضّر صباح كل يوم، مطهوة مع تشكيلة الفطر الطازج، الزعتر، والبارميزان المعتق.',
    },
    basePriceMad: 84,
    prepMinutes: 13,
    image: freshPastaImg,
    dietaryTag: { fr: 'Pâtes fraîches', ar: 'معكرونة طازجة' },
    portions: [
      { id: 'normal', label: { fr: 'Assiette Bistro', ar: 'طبق عادي' }, priceDelta: 0 },
      { id: 'generous', label: { fr: 'Grande Assiette', ar: 'طبق كبير' }, priceDelta: 20 },
    ],
    addons: [
      { id: 'grilled-chicken', label: { fr: 'Émincé de poulet grillé', ar: 'شرائح دجاج مشوي' }, price: 22 },
      { id: 'extra-parmesan', label: { fr: 'Supplément Parmesan 24 mois', ar: 'إضافة بارميزان معتق' }, price: 12 },
    ],
  },
  {
    id: 'loup-atlantique-chermoula',
    slug: 'loup-atlantique-chermoula',
    category: 'seafood-grill',
    name: {
      fr: 'Filet de Loup de l’Atlantique à la Chermoula',
      ar: 'فيليه سمك القرب الأطلسي بالشرمولة',
    },
    shortDesc: {
      fr: 'Pêche côtière du jour grillée sur peau, chermoula aux herbes fraîches, pommes grenaille au safran et légumes.',
      ar: 'صيد يومي من الساحل الأطلسي مشوي بالأعشاب، بطاطس بالزعفران وخضار مشوية.',
    },
    fullDesc: {
      fr: 'Filet de bar pêché sur la côte atlantique, snacké à la plancha avec une chermoula légère à la coriandre et citron confit, accompagné de pommes de terre grenaille safranées et légumes grillés.',
      ar: 'فيليه سمك طازج من الساحل الأطلسي مشوي على الصاج بتتبيلة الشرمولة الخفيفة والليمون المصير، يقدم مع بطاطس بالزعفران وخضار مشوية.',
    },
    basePriceMad: 118,
    prepMinutes: 18,
    image: atlanticSeabassImg,
    dietaryTag: { fr: 'Pêche locale', ar: 'صيد محلي طازج' },
    portions: [
      { id: 'classic', label: { fr: 'Filet Standard (220g)', ar: 'فيليه عادي (220 غ)' }, priceDelta: 0 },
      { id: 'double', label: { fr: 'Double Filet (360g)', ar: 'فيليه مضاعف (360 غ)' }, priceDelta: 45 },
    ],
    addons: [
      { id: 'saffron-rice', label: { fr: 'Riz basmati safrané en plus', ar: 'أرز بسمتي بالزعفران إضافي' }, price: 18 },
      { id: 'garlic-butter', label: { fr: 'Sauce beurre citronné & câpres', ar: 'صلصة الزبدة والليمون' }, price: 10 },
    ],
  },
  {
    id: 'burger-bistro-gruyere',
    slug: 'burger-bistro-gruyere',
    category: 'burgers-tacos',
    name: {
      fr: 'Burger Bistro · Bœuf Maturé & Gruyère',
      ar: 'برغر البيسترو · لحم بقري وجبنة غرويير',
    },
    shortDesc: {
      fr: 'Pain brioché toasté, steak haché boucher 180g, gruyère affiné, oignons confits, roquette et frites au romarin.',
      ar: 'خبز بريوش محمص، لحم بقري 180 غ، جبنة غرويير، بصل مكرمل، جرجير وبطاطس مقرمشة بإكليل الجبل.',
    },
    fullDesc: {
      fr: 'Bœuf haché minute saisi à la plancha, fromage gruyère fondant, confit d’oignons rouges au vinaigre balsamique, sauce bistro fumée et frites maison coupées au couteau.',
      ar: 'شريحة لحم بقري طازجة مشوية على الصاج، جبنة غرويير ذائبة، بصل مكرمل، صلصة البيسترو المدخنة وبطاطس منزلية مقرمشة.',
    },
    basePriceMad: 78,
    prepMinutes: 14,
    image: gourmetBurgerImg,
    portions: [
      { id: 'single', label: { fr: 'Simple Patty (180g)', ar: 'شريحة واحدة (180 غ)' }, priceDelta: 0 },
      { id: 'double', label: { fr: 'Double Patty (340g)', ar: 'شريحتان (340 غ)' }, priceDelta: 30 },
    ],
    addons: [
      { id: 'crispy-turkey', label: { fr: 'Dinde fumée grillée', ar: 'شرائح ديك رومي مدخن' }, price: 14 },
      { id: 'cheddar-sauce', label: { fr: 'Coupelle sauce cheddar maison', ar: 'صلصة الشيدر الدافئة' }, price: 12 },
      { id: 'sweet-potato', label: { fr: 'Frites de patate douce', ar: 'تبديل لبطاطس حلوة' }, price: 10 },
    ],
  },
  {
    id: 'tacos-gourmet-gratine',
    slug: 'tacos-gourmet-gratine',
    category: 'burgers-tacos',
    name: {
      fr: 'Tacos Gourmet Gratiné · Poulet Épicé & Emmental',
      ar: 'تاكوس غورميه غراتيني · دجاج متبل وإيمنتال',
    },
    shortDesc: {
      fr: 'Tortilla dorée gratinée à l’emmental, poulet mariné aux épices douces, sauce fromagère maison et frites.',
      ar: 'تورتيلا مقرمشة مغطاة بجبنة الإيمنتال، دجاج متبل، صلصة الجبن المنزلية وبطاطس مقلية.',
    },
    fullDesc: {
      fr: 'Le favori du déjeuner rapide : poulet fermier mariné au citron et paprika fumé, oignons caramélisés, sauce fromagère légère sans lourdeur, gratiné au four et servi avec frites fraîches.',
      ar: 'الأكثر طلباً لوجبة غداء سريعة: دجاج متبل بالليمون والبابريكا، بصل مكرمل، صلصة جبن خفيفة، محمر في الفرن ويقدم مع البطاطس المقلية.',
    },
    basePriceMad: 62,
    prepMinutes: 12,
    image: gourmetTacosImg,
    dietaryTag: { fr: 'Best-seller Midi', ar: 'الأكثر طلباً للغداء' },
    portions: [
      { id: 'm-size', label: { fr: 'Format M (1 viande)', ar: 'حجم متوسط (نوع واحد)' }, priceDelta: 0 },
      { id: 'l-size', label: { fr: 'Format L (Double garniture)', ar: 'حجم كبير (مضاعف)' }, priceDelta: 20 },
    ],
    addons: [
      { id: 'spicy-algerienne', label: { fr: 'Sauce Algérienne-Harissa à part', ar: 'صلصة جزائرية حارة جانبية' }, price: 5 },
      { id: 'extra-cheese-crust', label: { fr: 'Gratiné Cheddar & Mozzarella', ar: 'غراتيني شيدر وموتزاريلا إضافي' }, price: 12 },
    ],
  },
  {
    id: 'tiramisu-fleur-oranger',
    slug: 'tiramisu-fleur-oranger',
    category: 'desserts-drinks',
    name: {
      fr: 'Tiramisu Café Espresso & Fleur d’Oranger',
      ar: 'تيراميسو بالإسبريسو وزهر البرتقال',
    },
    shortDesc: {
      fr: 'Crème mascarpone légère, biscuits imbibés au double espresso et touche subtile de fleur d’oranger.',
      ar: 'كريمة ماسكاربوني خفيفة، بسكويت مشرب بالإسبريسو ولمسة عطرية من ماء الزهر.',
    },
    fullDesc: {
      fr: 'Notre dessert signature de fin de repas ou d’après-midi, préparé en verrine individuelle avec du cacao amer Valrhona et notre espresso maison.',
      ar: 'حلوى البيسترو المميزة لختام الوجبة أو استراحة ما بعد الظهيرة، محضرة بالكاكاو الفاخر وقهوتنا المختصة.',
    },
    basePriceMad: 42,
    prepMinutes: 4,
    image: specialtyLatteImg,
    isTableQuickReorder: true,
    dietaryTag: { fr: 'Fait maison', ar: 'تحضير منزلي' },
    portions: [
      { id: 'single', label: { fr: 'Verrine Individuelle', ar: 'حصة فردية' }, priceDelta: 0 },
    ],
    addons: [
      { id: 'mint-tea-pairing', label: { fr: 'Avec Thé à la menthe fraîche', ar: 'مع شاي بالنعناع الطازج' }, price: 18 },
    ],
  },
];

export function getDishBySlug(slug: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.slug === slug);
}

export function getDishById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.id === id);
}
