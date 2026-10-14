export function getArticleImageUrl(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}
