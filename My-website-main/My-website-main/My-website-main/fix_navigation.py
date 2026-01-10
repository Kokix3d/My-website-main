import os
import re

# Directories to process
dirs = ['Blender', 'Unreal', 'ae', 'pr', 'ps', 'Houdini', 'Softwear', 'web template']

# Pattern replacements for navigation links
replacements = [
    # Home and Membership
    (r'href="index\.html"', r'href="../index.html"'),
    (r'href="membership\.html"', r'href="../Membership/membership.html"'),
    
    # Dropdown toggles - change to # with onclick
    (r'href="blender\.html" class="dropdown-toggle"', r'href="#" class="dropdown-toggle" onclick="toggleSubmenu(event)"'),
    (r'href="unreal\.html" class="dropdown-toggle"', r'href="#" class="dropdown-toggle" onclick="toggleSubmenu(event)"'),
    (r'href="after-effects\.html" class="dropdown-toggle"', r'href="#" class="dropdown-toggle" onclick="toggleSubmenu(event)"'),
    (r'href="premiere-pro\.html" class="dropdown-toggle"', r'href="#" class="dropdown-toggle" onclick="toggleSubmenu(event)"'),
    (r'href="photoshop\.html" class="dropdown-toggle"', r'href="#" class="dropdown-toggle" onclick="toggleSubmenu(event)"'),
    (r'href="houdini\.html" class="dropdown-toggle"', r'href="#" class="dropdown-toggle" onclick="toggleSubmenu(event)"'),
    (r'href="website-templates\.html" class="dropdown-toggle"', r'href="#" class="dropdown-toggle" onclick="toggleSubmenu(event)"'),
    
    # Blender links
    (r'href="blender-addons\.html"', r'href="../Blender/blender-addons.html"'),
    (r'href="blender-assets\.html"', r'href="../Blender/blender-assets.html"'),
    (r'href="blender-3d\.html"', r'href="../Blender/blender-3d.html"'),
    
    # Unreal links
    (r'href="unreal-plugins\.html"', r'href="../Unreal/unreal-plugins.html"'),
    (r'href="unreal-assets\.html"', r'href="../Unreal/unreal-assets.html"'),
    (r'href="unreal-3d\.html"', r'href="../Unreal/unreal-3d.html"'),
    
    # After Effects links
    (r'href="ae-templates\.html"', r'href="../ae/ae-templates.html"'),
    (r'href="ae-presets\.html"', r'href="../ae/ae-presets.html"'),
    (r'href="ae-assets\.html"', r'href="../ae/ae-assets.html"'),
    
    # Premiere Pro links
    (r'href="pp-templates\.html"', r'href="../pr/pp-templates.html"'),
    (r'href="pp-presets\.html"', r'href="../pr/pp-presets.html"'),
    (r'href="pp-assets\.html"', r'href="../pr/pp-assets.html"'),
    
    # Photoshop links
    (r'href="psd-templates\.html"', r'href="../ps/psd-templates.html"'),
    (r'href="ps-brushes\.html"', r'href="../ps/ps-brushes.html"'),
    (r'href="ps-actions\.html"', r'href="../ps/ps-actions.html"'),
    
    # Houdini links
    (r'href="houdini-assets\.html"', r'href="../Houdini/houdini-assets.html"'),
    (r'href="houdini-presets\.html"', r'href="../Houdini/houdini-presets.html"'),
    (r'href="houdini-scripts\.html"', r'href="../Houdini/houdini-scripts.html"'),
    
    # Website template links
    (r'href="web-html\.html"', r'href="../web template/web-html.html"'),
    (r'href="web-wordpress\.html"', r'href="../web template/web-wordpress.html"'),
    (r'href="web-react\.html"', r'href="../web template/web-react.html"'),
    
    # Software link
    (r'href="software\.html">', r'href="../Softwear/software.html">'),
]

count = 0
for directory in dirs:
    dir_path = os.path.join(os.getcwd(), directory)
    if os.path.exists(dir_path):
        for filename in os.listdir(dir_path):
            if filename.endswith('.html'):
                filepath = os.path.join(dir_path, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    for pattern, replacement in replacements:
                        content = re.sub(pattern, replacement, content)
                    
                    if content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        count += 1
                        print(f'Fixed: {directory}/{filename}')
                except Exception as e:
                    print(f'Error processing {filepath}: {e}')

print(f'\nTotal files fixed: {count}')
