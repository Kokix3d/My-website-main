import os
import re
from pathlib import Path

# Discord invite link
discord_link = "https://discord.com/invite/PCZU4fM27s"

# Get all HTML files
root_dir = Path(__file__).parent
html_files = list(root_dir.rglob('*.html'))

print(f'Found {len(html_files)} HTML files to update')

count = 0
for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if Discord card exists
        if 'discord-card' not in content:
            continue
        
        # Update Discord link
        pattern = r'(<a href=")(#|https?://[^"]*)(" class="discord-btn")'
        if re.search(pattern, content):
            new_content = re.sub(
                pattern,
                r'\1' + discord_link + r'\3',
                content
            )
            
            if new_content != content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f'Updated: {html_file.relative_to(root_dir)}')
        
    except Exception as e:
        print(f'Error processing {html_file}: {e}')

print(f'\nTotal files updated: {count}')

