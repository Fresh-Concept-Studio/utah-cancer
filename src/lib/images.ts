/** Keep uploaded Sanity images on the CDN; only repository images have named variants. */
export function imageVariant(src: string, width: number, height?: number): string {
  if (!src) return '';
  if (/^https:\/\/cdn\.sanity\.io\/images\//.test(src)) {
    const image = new URL(src);
    image.searchParams.set('w', String(width));
    if (height) { image.searchParams.set('h', String(height)); image.searchParams.set('fit', 'crop'); }
    image.searchParams.set('auto', 'format');
    return image.toString();
  }
  if (/^https?:\/\//.test(src)) return src;
  return src.replace(/\.(?:jpe?g|png|webp)$/i, `-${width}.webp`);
}

/** Carry Studio crop and focal-point choices into every rendered image size. */
export function uploadedImageUrl(image: any): string | undefined {
  const src=image?.asset?.url || image?.url;
  if (!src) return undefined;
  const dimensions=src.match(/-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i);
  if (!dimensions || (!image.crop && !image.hotspot)) return src;
  const url=new URL(src);
  const width=Number(dimensions[1]), height=Number(dimensions[2]);
  const crop=image.crop || {left:0,right:0,top:0,bottom:0};
  const left=Math.round((crop.left || 0)*width), top=Math.round((crop.top || 0)*height);
  const croppedWidth=Math.max(1,width-left-Math.round((crop.right || 0)*width));
  const croppedHeight=Math.max(1,height-top-Math.round((crop.bottom || 0)*height));
  if (left || top || croppedWidth!==width || croppedHeight!==height) url.searchParams.set('rect',`${left},${top},${croppedWidth},${croppedHeight}`);
  if (image.hotspot) {
    const clamp=(n:number)=>Math.max(0,Math.min(1,n));
    url.searchParams.set('crop','focalpoint');
    url.searchParams.set('fp-x',String(clamp((image.hotspot.x*width-left)/croppedWidth)));
    url.searchParams.set('fp-y',String(clamp((image.hotspot.y*height-top)/croppedHeight)));
  }
  return url.toString();
}
