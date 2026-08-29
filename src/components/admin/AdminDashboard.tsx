import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import {
  adminFetchAllArticles,
  adminCreateArticle,
  adminUpdateArticle,
  adminDeleteArticle,
  adminFetchComments,
  adminApproveComment,
  adminDeleteComment,
  adminFetchSubscribers,
  adminDeleteSubscriber,
} from '@/lib/queries';
import type { Article, Comment, NewsletterSubscriber } from '@/lib/types';
import { categories, getCategoryName } from '@/lib/types';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Mail,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Eye,
  LogOut,
  ArrowLeft,
  Save,
  Star,
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

type Tab = 'overview' | 'articles' | 'comments' | 'subscribers';

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, c, s] = await Promise.all([
        adminFetchAllArticles(),
        adminFetchComments(),
        adminFetchSubscribers(),
      ]);
      setArticles(a);
      setComments(c);
      setSubscribers(s);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const pendingComments = comments.filter((c) => !c.is_approved);

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    const { error } = await adminDeleteArticle(id);
    if (error) {
      alert('فشل الحذف: ' + error);
    } else {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleApproveComment = async (id: string) => {
    const { error } = await adminApproveComment(id);
    if (error) {
      alert('فشل الموافقة: ' + error);
    } else {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_approved: true } : c))
      );
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    const { error } = await adminDeleteComment(id);
    if (error) {
      alert('فشل الحذف: ' + error);
    } else {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشترك؟')) return;
    const { error } = await adminDeleteSubscriber(id);
    if (error) {
      alert('فشل الحذف: ' + error);
    } else {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveArticle = async (data: Partial<Article>) => {
    if (editingArticle) {
      const { error } = await adminUpdateArticle(editingArticle.id, data);
      if (error) {
        alert('فشل التحديث: ' + error);
        return;
      }
    } else {
      const { error } = await adminCreateArticle({
        title: data.title ?? '',
        excerpt: data.excerpt ?? '',
        content: data.content ?? '',
        category: data.category ?? 'fashion',
        image_url: data.image_url ?? '',
        author: data.author ?? 'Pioneera',
        is_featured: data.is_featured ?? false,
        is_published: data.is_published ?? true,
        read_time: data.read_time ?? '',
      });
      if (error) {
        alert('فشل الإنشاء: ' + error);
        return;
      }
    }
    setShowEditor(false);
    setEditingArticle(null);
    await loadAll();
  };

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  const navItems: { id: Tab; label: string; icon: typeof FileText; badge?: number }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'articles', label: 'المقالات', icon: FileText },
    { id: 'comments', label: 'التعليقات', icon: MessageSquare, badge: pendingComments.length },
    { id: 'subscribers', label: 'المشتركون', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/IMG-20260828-WA0007.jpg"
              alt="Pioneera.net"
              className="h-10 w-auto object-contain"
            />
            <span className="hidden text-sm font-medium text-ink-500 sm:inline">
              لوحة التحكم
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-500 sm:inline">{user?.email}</span>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-ink-100"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">الموقع</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="w-16 flex-shrink-0 sm:w-56">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    tab === item.id
                      ? 'bg-brand-600 text-white'
                      : 'text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge ? (
                    <span className="mr-auto hidden rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white sm:inline">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-ink-400">جاري التحميل...</div>
            </div>
          ) : showEditor ? (
            <ArticleEditor
              article={editingArticle}
              onSave={handleSaveArticle}
              onCancel={() => {
                setShowEditor(false);
                setEditingArticle(null);
              }}
            />
          ) : (
            <>
              {tab === 'overview' && (
                <OverviewTab
                  articles={articles}
                  comments={comments}
                  subscribers={subscribers}
                  totalViews={totalViews}
                  pendingCount={pendingComments.length}
                />
              )}

              {tab === 'articles' && (
                <ArticlesTab
                  articles={articles}
                  onNew={() => {
                    setEditingArticle(null);
                    setShowEditor(true);
                  }}
                  onEdit={(article) => {
                    setEditingArticle(article);
                    setShowEditor(true);
                  }}
                  onDelete={handleDeleteArticle}
                />
              )}

              {tab === 'comments' && (
                <CommentsTab
                  comments={comments}
                  onApprove={handleApproveComment}
                  onDelete={handleDeleteComment}
                />
              )}

              {tab === 'subscribers' && (
                <SubscribersTab
                  subscribers={subscribers}
                  onDelete={handleDeleteSubscriber}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ===== Overview Tab =====
function OverviewTab({
  articles,
  comments,
  subscribers,
  totalViews,
  pendingCount,
}: {
  articles: Article[];
  comments: Comment[];
  subscribers: NewsletterSubscriber[];
  totalViews: number;
  pendingCount: number;
}) {
  const stats = [
    { label: 'المقالات', value: articles.length, icon: FileText, color: 'bg-brand-500' },
    { label: 'التعليقات', value: comments.length, icon: MessageSquare, color: 'bg-sky-500' },
    { label: 'المشتركون', value: subscribers.length, icon: Mail, color: 'bg-emerald-500' },
    { label: 'إجمالي المشاهدات', value: totalViews, icon: Eye, color: 'bg-accent-500' },
  ];

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold text-ink-800">نظرة عامة</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm">
              <div className={`mb-3 inline-flex rounded-lg p-2.5 ${stat.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-ink-800">{stat.value}</div>
              <div className="text-sm text-ink-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {pendingCount > 0 && (
        <div className="mt-6 rounded-xl bg-accent-50 p-4">
          <p className="text-sm font-medium text-accent-800">
            لديك {pendingCount} تعليق بانتظار الموافقة
          </p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-3 font-bold text-ink-700">أحدث المقالات</h3>
        <div className="space-y-2">
          {articles.slice(0, 5).map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {article.is_featured && (
                  <Star className="h-4 w-4 fill-accent-500 text-accent-500" />
                )}
                <span className="line-clamp-1 text-sm font-medium text-ink-700">
                  {article.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-400">
                <span>{getCategoryName(article.category)}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {article.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Articles Tab =====
function ArticlesTab({
  articles,
  onNew,
  onEdit,
  onDelete,
}: {
  articles: Article[];
  onNew: () => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-ink-800">المقالات</h2>
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          مقال جديد
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50 text-right text-xs text-ink-500">
              <th className="px-4 py-3 font-medium">العنوان</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">القسم</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">المشاهدات</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">الحالة</th>
              <th className="px-4 py-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr
                key={article.id}
                className="border-b border-ink-50 transition-colors hover:bg-ink-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {article.is_featured && (
                      <Star className="h-4 w-4 flex-shrink-0 fill-accent-500 text-accent-500" />
                    )}
                    <span className="line-clamp-1 text-sm font-medium text-ink-700">
                      {article.title}
                    </span>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-sm text-ink-500 sm:table-cell">
                  {getCategoryName(article.category)}
                </td>
                <td className="hidden px-4 py-3 text-sm text-ink-500 sm:table-cell">
                  {article.views}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      article.is_published
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    {article.is_published ? 'منشور' : 'مسودة'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(article)}
                      className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(article.id)}
                      className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== Comments Tab =====
function CommentsTab({
  comments,
  onApprove,
  onDelete,
}: {
  comments: Comment[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold text-ink-800">التعليقات</h2>
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-ink-400 shadow-sm">
            لا توجد تعليقات
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink-800">{comment.name}</span>
                    {!comment.is_approved && (
                      <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700">
                        بانتظار الموافقة
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-600">{comment.content}</p>
                  <p className="mt-2 text-xs text-ink-400">
                    {new Date(comment.created_at).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!comment.is_approved && (
                    <button
                      onClick={() => onApprove(comment.id)}
                      className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                      title="موافقة"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                    title="حذف"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ===== Subscribers Tab =====
function SubscribersTab({
  subscribers,
  onDelete,
}: {
  subscribers: NewsletterSubscriber[];
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold text-ink-800">المشتركون</h2>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {subscribers.length === 0 ? (
          <div className="p-8 text-center text-ink-400">لا يوجد مشتركون</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50 text-right text-xs text-ink-500">
                <th className="px-4 py-3 font-medium">البريد الإلكتروني</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">تاريخ الاشتراك</th>
                <th className="px-4 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-ink-50 transition-colors hover:bg-ink-50"
                >
                  <td className="px-4 py-3 text-sm text-ink-700" dir="ltr">
                    {sub.email}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-ink-500 sm:table-cell">
                    {new Date(sub.subscribed_at).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(sub.id)}
                      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ===== Article Editor =====
function ArticleEditor({
  article,
  onSave,
  onCancel,
}: {
  article: Article | null;
  onSave: (data: Partial<Article>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(article?.title ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [content, setContent] = useState(article?.content ?? '');
  const [category, setCategory] = useState(article?.category ?? 'fashion');
  const [imageUrl, setImageUrl] = useState(article?.image_url ?? '');
  const [author, setAuthor] = useState(article?.author ?? 'Pioneera');
  const [readTime, setReadTime] = useState(article?.read_time ?? '');
  const [isFeatured, setIsFeatured] = useState(article?.is_featured ?? false);
  const [isPublished, setIsPublished] = useState(article?.is_published ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      excerpt,
      content,
      category,
      image_url: imageUrl,
      author,
      read_time: readTime,
      is_featured: isFeatured,
      is_published: isPublished,
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-ink-800">
          {article ? 'تعديل المقال' : 'مقال جديد'}
        </h2>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-ink-100"
        >
          <X className="h-4 w-4" />
          إلغاء
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">العنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">الملخص</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">المحتوى</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">القسم</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              وقت القراءة
            </label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="٥ دقائق"
              className="w-full rounded-lg border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            رابط الصورة
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            dir="ltr"
            placeholder="https://..."
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">الكاتب</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            مقال مميز (يظهر في الواجهة)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            منشور
          </label>
        </div>

        <div className="flex gap-3 border-t border-ink-100 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            <Save className="h-4 w-4" />
            حفظ
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
