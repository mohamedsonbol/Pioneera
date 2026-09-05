import { defineField, defineType } from 'sanity';

type ArticleDocument = Record<string, unknown> & { articleStatus?: string; isHotTopic?: boolean };
const requiredForPublished = (document: ArticleDocument) => {
  const missing = ['titleAr', 'slug', 'excerpt', 'body', 'author', 'category', 'mainImage', 'publishedAt'].filter(
    (field) => !document[field]
  );
  const image = document.mainImage as { alt?: string } | undefined;
  if (!image?.alt?.trim()) missing.push('mainImage.alt');
  return missing;
};

export const article = defineType({
  name: 'article',
  title: 'مقال',
  type: 'document',
  fields: [
    defineField({ name: 'titleAr', title: 'العنوان العربي', type: 'string' }),
    defineField({ name: 'titleEn', title: 'English title', type: 'string' }),
    defineField({ name: 'slug', title: 'الرابط الدائم', type: 'slug', options: { source: 'titleAr', maxLength: 96 }, validation: (Rule) => Rule.required(), readOnly: ({ document }) => document?.articleStatus === 'published' }),
    defineField({ name: 'excerpt', title: 'المقتطف', type: 'text', rows: 3 }),
    defineField({ name: 'body', title: 'المحتوى', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'mainImage', title: 'الصورة الرئيسية', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'النص البديل', type: 'string' }), defineField({ name: 'caption', title: 'التعليق', type: 'string' })] }),
    defineField({ name: 'gallery', title: 'معرض الصور', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'النص البديل', type: 'string' }), defineField({ name: 'caption', title: 'التعليق', type: 'string' })] }] }),
    defineField({ name: 'author', title: 'الكاتب', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'category', title: 'القسم', type: 'reference', to: [{ type: 'category' }] }),
    defineField({ name: 'tags', title: 'الوسوم', type: 'array', of: [{ type: 'reference', to: [{ type: 'tag' }] }] }),
    defineField({ name: 'isFeatured', title: 'مقال مميز', type: 'boolean', initialValue: false }),
    defineField({ name: 'isHotTopic', title: 'موضوع ساخن', type: 'boolean', initialValue: false }),
    defineField({ name: 'commentsEnabled', title: 'تفعيل التعليقات', type: 'boolean', initialValue: false, validation: (Rule) => Rule.custom((value, context) => value && !(context.document as ArticleDocument | undefined)?.isHotTopic ? 'لا يمكن تفعيل التعليقات إلا للموضوعات الساخنة.' : true) }),
    defineField({ name: 'publishedAt', title: 'تاريخ النشر', type: 'datetime' }),
    defineField({ name: 'scheduledAt', title: 'تاريخ الجدولة', type: 'datetime' }),
    defineField({ name: 'seoTitle', title: 'عنوان SEO', type: 'string', validation: (Rule) => Rule.max(60).warning('يفضل ألا يتجاوز 60 حرفاً.') }),
    defineField({ name: 'seoDescription', title: 'وصف SEO', type: 'text', rows: 3, validation: (Rule) => Rule.max(160).warning('يفضل ألا يتجاوز 160 حرفاً.') }),
    defineField({ name: 'socialImage', title: 'صورة اجتماعية', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'canonicalUrl', title: 'الرابط الأساسي', type: 'url' }),
    defineField({ name: 'articleStatus', title: 'الحالة', type: 'string', initialValue: 'draft', options: { list: [{ title: 'مسودة', value: 'draft' }, { title: 'مجدول', value: 'scheduled' }, { title: 'منشور', value: 'published' }, { title: 'مؤرشف', value: 'archived' }] }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'legacyId', title: 'معرّف Supabase القديم', type: 'string', readOnly: true }),
  ],
  validation: (Rule) => Rule.custom((document) => {
    const articleDocument = document as ArticleDocument;
    if (articleDocument.articleStatus !== 'published') return true;
    const missing = requiredForPublished(articleDocument);
    return missing.length ? `المقال المنشور يحتاج: ${missing.join(', ')}` : true;
  }),
  preview: { select: { title: 'titleAr', subtitle: 'articleStatus', media: 'mainImage' } },
});
