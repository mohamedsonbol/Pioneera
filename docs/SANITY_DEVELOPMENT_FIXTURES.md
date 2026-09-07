# Sanity development fixtures

Create these documents only in the **development** dataset through `/studio` after explicit approval.

1. Author: name `ليلى التجريبية`, slug `layla-test`, with a biography.
2. Categories: `جمال` / `beauty` and `صحة` / `health`; add relevant tags such as `عناية` and `عافية`.
3. Published normal article: slug `development-normal-article`, reference `beauty` and `layla-test`, `articleStatus: published`, a publication date, image, and meaningful Arabic alt text. Keep hot-topic and comments disabled.
4. Published hot topic: slug `development-hot-topic`, reference `health` and `layla-test`, `articleStatus: published`, `isHotTopic: true`, `commentsEnabled: true`, publication date, image, and Arabic alt text.
5. Draft: slug `development-draft-article`, `articleStatus: draft`; it must not appear on public routes.

Check `/article/development-normal-article`, `/article/development-hot-topic`, `/category/beauty`, `/author/layla-test`, `/latest`, `/hot-topics`, and search. Confirm the draft is absent.
