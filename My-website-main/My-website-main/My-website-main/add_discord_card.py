import os
import re
from pathlib import Path

# Discord card HTML to insert
discord_card_html = '''      <!-- Discord Card -->
      <div class="discord-card">
        <div class="discord-logo">
          <i class="fab fa-discord"></i>
        </div>
        <div class="discord-status">
          <span class="status-dot"></span>
          <span class="status-text">129 Online</span>
        </div>
        <h4 class="discord-title">Join Our Discord</h4>
        <p class="discord-desc">Chat, get support, and connect with the community.</p>
        <a href="#" class="discord-btn" target="_blank">
          <i class="fab fa-discord"></i>
          Join Now
        </a>
      </div>
'''

# Get all HTML files except index.html (already has it)
root_dir = Path(__file__).parent
html_files = []

# Find all HTML files
for html_file in root_dir.rglob('*.html'):
    # Skip index.html as it already has Discord card
    if html_file.name == 'index.html':
        continue
    # Skip detail pages (addon-detail, asset-detail)
    if 'detail' in html_file.name.lower():
        continue
    html_files.append(html_file)

print(f'Found {len(html_files)} HTML files to update')

count = 0
for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if Discord card already exists
        if 'discord-card' in content:
            print(f'Already has Discord card: {html_file.relative_to(root_dir)}')
            continue
        
        # Find </nav> tag and insert Discord card before </aside>
        # Pattern 1: </nav>\n    </aside>
        pattern1 = r'(</nav>)\s*(</aside>)'
        if re.search(pattern1, content):
            content = re.sub(
                pattern1,
                r'\1\n\n' + discord_card_html + r'\n    \2',
                content
            )
            count += 1
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated: {html_file.relative_to(root_dir)}')
            continue
        
        # Pattern 2: </nav> with different spacing
        pattern2 = r'(</nav>)\s*\n\s*(</aside>)'
        if re.search(pattern2, content):
            content = re.sub(
                pattern2,
                r'\1\n\n' + discord_card_html + r'\n    \2',
                content
            )
            count += 1
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated: {html_file.relative_to(root_dir)}')
            continue
        
        print(f'Could not find pattern in: {html_file.relative_to(root_dir)}')
        
    except Exception as e:
        print(f'Error processing {html_file}: {e}')

print(f'\nTotal files updated: {count}')

