import os
import re

# Read the script.js to extract image paths from products and membershipProducts
root = os.path.dirname(__file__)
js_path = os.path.join(root, 'script.js')

pattern = re.compile(r"image:\s*\"([^\"]+)\"")
paths = []

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()
    paths = pattern.findall(content)

report = []
missing = []

for p in paths:
    p_clean = p.replace('/', os.sep)
    full = os.path.join(root, p_clean)
    exists = os.path.exists(full)
    report.append((p, exists, full))
    if not exists:
        missing.append((p, full))

print('Total image references found:', len(report))
for p, exists, full in report:
    status = 'OK' if exists else 'MISSING'
    print(f'{status}: {p} -> {full}')

print('\nSummary:')
print('Present:', len([r for r in report if r[1]]))
print('Missing:', len(missing))

if missing:
    print('\nMissing files list:')
    for p, full in missing:
        print(p)
