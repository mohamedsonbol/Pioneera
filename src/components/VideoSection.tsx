import { Play, ArrowLeft, Eye } from 'lucide-react';
import { videoArticles, categories } from '@/data/articles';

function getCategoryName(id: string) {
  return categories.find((c) => c.id === id)?.name ?? '';
}

export default function VideoSection() {
  const [main, ...rest] = videoArticles;

  return (
    <section className="bg-ink-900 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-1.5 rounded-full bg-brand-500" />
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 fill-brand-500 text-brand-500" />
              <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">سيدتي فيديو</h2>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300">
            عرض الكل
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Main video */}
          <div className="group cursor-pointer lg:col-span-2">
            <div className="relative h-[280px] overflow-hidden rounded-xl sm:h-[400px]">
              <img
                src={main.image}
                alt={main.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/90 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-500">
                  <Play className="h-7 w-7 fill-white text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-5">
                <span className="category-pill bg-brand-500 text-white">
                  {getCategoryName(main.category)}
                </span>
                <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold text-white sm:text-xl">
                  {main.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Side videos */}
          <div className="flex flex-col gap-4">
            {rest.map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative h-32 overflow-hidden rounded-xl">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-ink-900/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/90 shadow-md transition-transform group-hover:scale-110">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </div>
                    <div className="pr-3">
                      <h4 className="line-clamp-2 text-sm font-bold text-white">{video.title}</h4>
                      <span className="mt-1 flex items-center gap-1 text-xs text-ink-300">
                        <Eye className="h-3 w-3" />
                        {video.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
