import os
import re
from pathlib import Path

# Updated Discord card HTML with total members
discord_card_html = '''      <!-- Discord Card -->
      <div class="discord-card">
        <div class="discord-logo">
          <i class="fab fa-discord"></i>
        </div>
        <div class="discord-status">
          <span class="status-dot"></span>
          <span class="status-text"><span class="online-count">129</span> Online</span>
        </div>
        <div class="discord-total-members">
          <span class="total-count">1,234</span> Members
        </div>
        <h4 class="discord-title">Join Our Discord</h4>
        <p class="discord-desc">Chat, get support, and connect with the community.</p>
        <a href="https://discord.com/invite/PCZU4fM27s" class="discord-btn" target="_blank">
          <i class="fab fa-discord"></i>
          Join Now
        </a>
      </div>
'''

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
        
        # Check if already has total members
        if 'discord-total-members' in content:
            print(f'Already has total members: {html_file.relative_to(root_dir)}')
            continue
        
        # Find and replace old Discord card with new one
        pattern = r'(<!-- Discord Card -->\s*<div class="discord-card">.*?</div>\s*</div>)'
        
        old_card_match = re.search(pattern, content, re.DOTALL)
        if old_card_match:
            # Replace old card
            content = content.replace(old_card_match.group(1), discord_card_html.strip())
            
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f'Updated: {html_file.relative_to(root_dir)}')
        
    except Exception as e:
        print(f'Error processing {html_file}: {e}')

print(f'\nTotal files updated: {count}')

