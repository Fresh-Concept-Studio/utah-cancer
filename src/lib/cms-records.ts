import {uploadedImageUrl} from './images'
/** Convert the published CMS shapes to the website’s content records. */
export function convert(value: any): any {
  if (Array.isArray(value)) return value.map(convert)
  if (!value || typeof value !== 'object') return value
  if (value._type === 'slug') return value.current
  if (typeof value.href === 'string' && typeof value.html === 'string') {
    const {href, html, class: className, target, rel} = value
    return {html, attrs: Object.fromEntries(Object.entries({href, class: className, target, rel}).filter(([, item]) => item))}
  }
  const converted = Object.fromEntries(Object.entries(value)
    .filter(([key]) => !key.startsWith('_') && key !== 'asset')
    .map(([key, item]) => [key, convert(item)]))
  if (value._type === 'legacyImage') converted.src = uploadedImageUrl(value.asset) || converted.src
  return converted
}
