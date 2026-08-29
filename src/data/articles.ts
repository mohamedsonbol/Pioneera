export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'fashion', name: 'أزياء', color: 'bg-brand-500', icon: 'Shirt' },
  { id: 'beauty', name: 'جمال', color: 'bg-accent-500', icon: 'Sparkles' },
  { id: 'health', name: 'صحة', color: 'bg-emerald-500', icon: 'Heart' },
  { id: 'family', name: 'سيدتي وطفلك', color: 'bg-sky-500', icon: 'Baby' },
  { id: 'food', name: 'مطبخ', color: 'bg-orange-500', icon: 'UtensilsCrossed' },
  { id: 'decor', name: 'منزل', color: 'bg-violet-500', icon: 'Home' },
  { id: 'stars', name: 'نجوم', color: 'bg-rose-500', icon: 'Star' },
  { id: 'video', name: 'فيديو', color: 'bg-ink-800', icon: 'Play' },
];

export const featuredArticle: Article = {
  id: 'f1',
  title: 'لاعبة التنس المحترفة المصرية ميار شريف: انتصارات متتالية ووجهة واحدة.. القمة',
  excerpt:
    'من قلب التحديات إلى قمة التتويج، رحلة الكفاح والنجاح التي قادت ميار شريف لتصبح أول مصرية تصل إلى مراكز متقدمة في تصنيف التنس العالمي للسيدات.',
  category: 'stars',
  image: 'https://images.pexels.com/photos/35217923/pexels-photo-35217923.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  author: 'سيدتي',
  date: '٢٨ أغسطس ٢٠٢٦',
  readTime: '٥ دقائق',
  featured: true,
};

export const heroArticles: Article[] = [
  {
    id: 'h1',
    title: 'من كيت هدسون الى تايلور سويفت.. كيف نسقت النجمات إطلالاتهن هذا الموسم',
    excerpt: 'أبرز إطلالات النجمات في أحدث المناسبات العالمية وكيف يمكنك استلهامها.',
    category: 'fashion',
    image: 'https://images.pexels.com/photos/20238933/pexels-photo-20238933.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٧ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 'h2',
    title: 'روتين العناية بالبشرة في الخريف: خطوات بسيطة لإشراقة تدوم',
    excerpt: 'مع تغير الفصول، تحتاج بشرتك إلى روتين مختلف. إليك أهم الخطوات للحفاظ على نضارتها.',
    category: 'beauty',
    image: 'https://images.pexels.com/photos/7670737/pexels-photo-7670737.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٦ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
  {
    id: 'h3',
    title: 'أهمية التغذية أثناء الحمل لذكاء الجنين وصحة الأم',
    excerpt: 'خبراء التغذية يكشفون عن الأطعمة الأساسية التي يجب تناولها خلال فترة الحمل.',
    category: 'health',
    image: 'https://images.pexels.com/photos/31189941/pexels-photo-31189941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٥ أغسطس ٢٠٢٦',
    readTime: '٦ دقائق',
  },
];

export const fashionArticles: Article[] = [
  {
    id: 'fa1',
    title: 'ألوان الخريف ٢٠٢٦: دليلك الكامل لإطلالات متناسقة',
    excerpt: 'تعرفي على درجات الألوان الأكثر رواجاً هذا الموسم وكيفية تنسيقها.',
    category: 'fashion',
    image: 'https://images.pexels.com/photos/24740631/pexels-photo-24740631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٤ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 'fa2',
    title: 'إطلالات أنيقة للمناسبات المسائية',
    excerpt: 'أفكار لإطلالات راقية تناسب السهرات والمناسبات الخاصة.',
    category: 'fashion',
    image: 'https://images.pexels.com/photos/21789892/pexels-photo-21789892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٣ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
  {
    id: 'fa3',
    title: 'كيف تختارين فستانك حسب نوع جسمك؟',
    excerpt: 'دليل عملي لاختيار الفستان الذي يبرز جمالك ويناسب ملامح جسمك.',
    category: 'fashion',
    image: 'https://images.pexels.com/photos/28232246/pexels-photo-28232246.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٢ أغسطس ٢٠٢٦',
    readTime: '٥ دقائق',
  },
];

export const beautyArticles: Article[] = [
  {
    id: 'be1',
    title: 'ماسكات طبيعية لبشرة نضرة في دقائق',
    excerpt: 'وصفات منزلية بسيطة لماسكات تمنح بشرتك إشراقة فورية.',
    category: 'beauty',
    image: 'https://images.pexels.com/photos/12969358/pexels-photo-12969358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٤ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
  {
    id: 'be2',
    title: 'أفضل منتجات العناية بالبشرة الدهنية',
    excerpt: 'تشكيلة مختارة من أفضل المنتجات المناسبة للبشرة الدهنية.',
    category: 'beauty',
    image: 'https://images.pexels.com/photos/7256102/pexels-photo-7256102.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٣ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 'be3',
    title: 'فن المكياج الناعم لإطلالة يومية طبيعية',
    excerpt: 'خطوات المكياج الناعم الذي يبرز جمالك دون تكلف.',
    category: 'beauty',
    image: 'https://images.pexels.com/photos/1470165/pexels-photo-1470165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٢ أغسطس ٢٠٢٦',
    readTime: '٥ دقائق',
  },
];

export const familyArticles: Article[] = [
  {
    id: 'fa1',
    title: '٨ أفكار ذكية للاستفادة من ملابس المولود التي لم يعد يرتديها',
    excerpt: 'طرق مبتكرة لإعادة تدوير ملابس الأطفال وتحويلها لأشياء مفيدة.',
    category: 'family',
    image: 'https://images.pexels.com/photos/32182116/pexels-photo-32182116.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٤ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 'fa2',
    title: 'أهم مستلزمات العودة للمدارس لمرحلة الروضة',
    excerpt: 'قائمة ذكية تساعد طفلك على بداية مريحة في العام الدراسي الجديد.',
    category: 'family',
    image: 'https://images.pexels.com/photos/19773886/pexels-photo-19773886.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٣ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
  {
    id: 'fa3',
    title: 'كيف تتعاملين مع اكتئاب الحمل وما بعد الولادة؟',
    excerpt: 'نصائح من المختصين للتعامل مع التغيرات النفسية أثناء الحمل وبعده.',
    category: 'health',
    image: 'https://images.pexels.com/photos/4589461/pexels-photo-4589461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٢ أغسطس ٢٠٢٦',
    readTime: '٦ دقائق',
  },
];

export const foodArticles: Article[] = [
  {
    id: 'fo1',
    title: 'وصفات عشاء سريعة وصحية لأيام الأسبوع',
    excerpt: 'وجبات لذيذة وسهلة التحضير لا تستغرق أكثر من ٣٠ دقيقة.',
    category: 'food',
    image: 'https://images.pexels.com/photos/7262349/pexels-photo-7262349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٤ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 'fo2',
    title: 'أطباق الخريف الدافئة: شوربات تمنحك الدفء',
    excerpt: 'تشكيلة من الشوربات المغذية واللذيذة لليالي الخريف الباردة.',
    category: 'food',
    image: 'https://images.pexels.com/photos/5908196/pexels-photo-5908196.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٣ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
  {
    id: 'fo3',
    title: 'حلويات صحية للأطفال بدون سكر مضاف',
    excerpt: 'وصفات حلويات لذيذة وغنية بالعناصر الغذائية للأطفال.',
    category: 'food',
    image: 'https://images.pexels.com/photos/7262343/pexels-photo-7262343.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٢ أغسطس ٢٠٢٦',
    readTime: '٥ دقائق',
  },
];

export const decorArticles: Article[] = [
  {
    id: 'de1',
    title: 'ديكورات الخريف: كيف تجددين منزلك بأقل التكاليف؟',
    excerpt: 'أفكار بسيطة وميزانية محدودة لتجديد ديكور منزلك في الخريف.',
    category: 'decor',
    image: 'https://images.pexels.com/photos/12885119/pexels-photo-12885119.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٤ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 'de2',
    title: 'تنظيم المساحات الصغيرة في المنزل بذكاء',
    excerpt: 'حلول عملية لتنظيم المنازل الصغيرة واستغلال كل ركن.',
    category: 'decor',
    image: 'https://images.pexels.com/photos/11296142/pexels-photo-11296142.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٣ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
  {
    id: 'de3',
    title: 'ألوان الجدران الأكثر رواجاً لعام ٢٠٢٦',
    excerpt: 'دليل لاختيار ألوان الجدران العصرية التي تمنح منزلك حياة جديدة.',
    category: 'decor',
    image: 'https://images.pexels.com/photos/13490221/pexels-photo-13490221.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٢ أغسطس ٢٠٢٦',
    readTime: '٥ دقائق',
  },
];

export const videoArticles: Article[] = [
  {
    id: 'v1',
    title: 'سيدتي ترافق أبطال الفيلم الجديد في عرض خاص',
    excerpt: 'لقاء حصري مع نجوم الفيلم في العرض الأول.',
    category: 'video',
    image: 'https://images.pexels.com/photos/32251059/pexels-photo-32251059.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٤ أغسطس ٢٠٢٦',
    readTime: 'فيديو',
  },
  {
    id: 'v2',
    title: 'كيف تحصلين على إطلالة مثالية في ٥ دقائق؟',
    excerpt: 'فيديو تعليمي لخطوات المكياج السريع.',
    category: 'video',
    image: 'https://images.pexels.com/photos/19909750/pexels-photo-19909750.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٣ أغسطس ٢٠٢٦',
    readTime: 'فيديو',
  },
  {
    id: 'v3',
    title: 'وصفة الحلويات الشهيرة في ٣ دقائق',
    excerpt: 'فيديو سريع لتحضير حلى لذيذ وسهل.',
    category: 'video',
    image: 'https://images.pexels.com/photos/36697445/pexels-photo-36697445.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    author: 'سيدتي',
    date: '٢٢ أغسطس ٢٠٢٦',
    readTime: 'فيديو',
  },
];

export const trendingArticles: Article[] = [
  {
    id: 't1',
    title: 'علاج تساقط الشعر: الحلول الطبيعية والطبية',
    excerpt: '',
    category: 'beauty',
    image: '',
    author: 'سيدتي',
    date: '٢٤ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 't2',
    title: 'تمارين رياضية منزلية للحفاظ على لياقتك',
    excerpt: '',
    category: 'health',
    image: '',
    author: 'سيدتي',
    date: '٢٣ أغسطس ٢٠٢٦',
    readTime: '٥ دقائق',
  },
  {
    id: 't3',
    title: 'كيف تتعاملين مع الغيرة بين الإخوة؟',
    excerpt: '',
    category: 'family',
    image: '',
    author: 'سيدتي',
    date: '٢٢ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
  {
    id: 't4',
    title: 'أفضل الوجهات السياحية لخريف ٢٠٢٦',
    excerpt: '',
    category: 'stars',
    image: '',
    author: 'سيدتي',
    date: '٢١ أغسطس ٢٠٢٦',
    readTime: '٤ دقائق',
  },
  {
    id: 't5',
    title: 'نصائح للحفاظ على روتين يومي صحي',
    excerpt: '',
    category: 'health',
    image: '',
    author: 'سيدتي',
    date: '٢٠ أغسطس ٢٠٢٦',
    readTime: '٣ دقائق',
  },
];
