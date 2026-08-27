#!/usr/bin/env bash
echo "Minifying CSS..."
sed -e 's/\/\*.*\*\///g' -e 's/^[ \t]*//g' -e 's/[ \t]*$//g' style.css | tr -d '\n' > style.min.css

echo "Basic JS minification (removing comments)..."
sed -e 's/\/\/.*//g' script.js > script.min.js

echo "Build complete! (style.min.css and script.min.js updated)"

echo "Injecting HTML partials..."
cat << 'PY_EOF' > _build_html.py
import re
import glob

with open('_partials/header.html', 'r') as f:
    header_partial = f.read()

with open('_partials/footer.html', 'r') as f:
    footer_partial = f.read()

html_files = glob.glob('**/*.html', recursive=True)

for html_file in html_files:
    if html_file.startswith('_') or 'gas/' in html_file.replace('\\', '/'):
        continue

    depth = html_file.count('/') + html_file.count('\\')
    root_prefix = '../' * depth
    if root_prefix == '':
        root_prefix = 'index.html'

    with open(html_file, 'r') as f:
        content = f.read()

    new_content = re.sub(r'<header>.*?</header>', header_partial.replace('{{ROOT}}', root_prefix), content, flags=re.DOTALL)
    new_content = re.sub(r'<footer>.*?</footer>', footer_partial.replace('{{ROOT}}', root_prefix), new_content, flags=re.DOTALL)

    if new_content != content:
        with open(html_file, 'w') as f:
            f.write(new_content)
        print(f"Updated {html_file}")
PY_EOF
python3 _build_html.py
rm _build_html.py
echo "Done!"
