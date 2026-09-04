import re
from pathlib import Path

text = Path('products.html').read_text(encoding='utf-8')
start = text.find('const assets = [')
if start == -1:
    raise SystemExit('assets block not found')
start = text.find('[', start)
end = text.find('];', start)
block = text[start:end+2]
# find quoted assets
assets = re.findall(r"'([^']+\.(?:jpg|png|jpeg|gif))'", block)

# find existing image sources in grid
existing = set(re.findall(r'<img[^>]+src="([^"]+)"', text))

# helper functions

def slugify(text):
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', text.lower()))

def titleize(filename):
    name = re.sub(r'\.[^.]+$', '', filename)
    name = name.replace('_', ' ').strip()
    name = re.sub(r'\s+', ' ', name)
    return ' '.join(word.capitalize() for word in name.split(' '))

def get_category(title):
    value = title.lower()
    if re.search(r'\b(office|desk|studio|organizer|counter|cabinet|microwave|pantry)\b', value):
        return 'Office'
    if re.search(r'\b(bed|wardrobe|bedroom|nightstand|bedside)\b', value):
        return 'Bedroom'
    if re.search(r'\b(lamp|light|lighting)\b', value):
        return 'Lighting'
    if re.search(r'\b(mirror|decor|accent|flower|pedestal|pink|green|royal|brand|bg|hero)\b', value):
        return 'Decor'
    if re.search(r'\b(table|dining|sideboard|console|round|kitchen|shelf|storage|pantry|bench)\b', value):
        return 'Dining'
    if re.search(r'\b(sofa|couch|lounge|daybed|chair|bench|seat|set|air|ribbon|yeti)\b', value):
        return 'Living'
    return 'Accent'

def get_price(title):
    value = title.lower()
    base = 320000
    if re.search(r'\b(sofa|couch|lounge|daybed|set|bench)\b', value):
        base = 1600000
    elif re.search(r'\b(bed|wardrobe|console|sideboard|table|dining|kitchen|office|desk|cabinet|shelf|storage|pantry)\b', value):
        base = 980000
    elif re.search(r'\b(lamp|mirror|decor|accent|flower|pedestal|nightstand|chair|stool|brand|bg|hero)\b', value):
        base = 210000
    seed = sum(ord(ch) for ch in value)
    return round(base + (seed % 7) * 26000 + (seed % 5) * 14000)

def get_description(title):
    return f'A carefully styled {title.lower()} that blends warm materials with refined simplicity.'

def render(product):
    return f'''<article class="product-card reveal-on-scroll">
  <div class="product-card-image">
    <img src="{product['src']}" alt="{product['title']}" loading="lazy">
    <div class="quick-actions">
      <button class="quick-btn">Quick Shop</button>
      <button class="wishlist" aria-label="Add {product['title']} to wishlist">♡</button>
    </div>
  </div>
  <div class="product-card-meta">
    <p class="collection">{product['category']}</p>
    <h3 class="title">{product['title']}</h3>
    <p class="card-description">{product['description']}</p>
    <div class="product-bottom">
      <p class="price">₦{product['price']:,}</p>
      <button type="button" class="btn btn-primary js-add-to-cart" data-id="{product['id']}" data-title="{product['title']}" data-price="{product['price']}" data-image="{product['src']}">Add to cart</button>
    </div>
  </div>
</article>'''

products = []
for asset in assets:
    src = f'IMAGES/{asset}'
    if src in existing:
        continue
    title = titleize(asset)
    products.append({
        'src': src,
        'title': title,
        'category': get_category(title),
        'description': get_description(title),
        'price': get_price(title),
        'id': slugify(title)
    })

# output missing product html
output = '\n'.join(render(p) for p in products)
Path('products-static-output.html').write_text(output, encoding='utf-8')
Path('products-static-asset.txt').write_text('\n'.join(assets), encoding='utf-8')
print(f'Wrote {len(products)} missing products to products-static-output.html')
"