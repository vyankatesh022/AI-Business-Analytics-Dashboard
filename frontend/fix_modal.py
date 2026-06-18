import re

file_path = r"e:\project\AI-Business-Analytics-Dashboard\AI-Business-Analytics-Dashboard\frontend\components\datasets\RemoteImportModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def replacer(match):
    dark_classes = match.group(1)
    
    replacements = {
        r'text-white': r'text-[var(--text-primary)]',
        r'text-zinc-200': r'text-[var(--text-primary)]',
        r'text-zinc-350': r'text-[var(--text-secondary)]',
        r'text-zinc-400': r'text-[var(--text-secondary)]',
        r'text-zinc-500': r'text-[var(--text-secondary)]',
        r'text-zinc-550': r'text-[var(--text-secondary)]',
        
        r'bg-zinc-950/90': r'bg-[var(--card-color)]/90',
        r'bg-zinc-950': r'bg-[var(--card-color)]',
        
        r'bg-zinc-900/40': r'bg-[var(--bg-color)]',
        r'bg-zinc-900': r'bg-[var(--bg-color)]',
        
        r'border-zinc-900': r'border-[var(--border-color)]',
        r'border-zinc-850': r'border-[var(--border-color)]',
        r'border-zinc-800': r'border-[var(--border-color)]',
        r'border-zinc-750': r'border-[var(--brand-primary)]',
        
        r'hover:bg-zinc-900': r'hover:bg-[var(--bg-color)]',
        r'hover:text-white': r'hover:text-[var(--text-primary)]',
        r'hover:border-zinc-750': r'hover:border-[var(--brand-primary)]',
        
        r'placeholder-zinc-550': r'placeholder-[var(--text-secondary)]',
        r'placeholder-zinc-600': r'placeholder-[var(--text-secondary)]',
        r'placeholder-zinc-650': r'placeholder-[var(--text-secondary)]',
    }
    
    new_classes = dark_classes
    for old, new in replacements.items():
        # strict replacement to avoid partial
        new_classes = re.sub(rf'\b{re.escape(old)}(?![/\w-])', new, new_classes)
        
    # some classes might be missed, let's catch generic ones
    new_classes = new_classes.replace('bg-zinc-950', 'bg-[var(--card-color)]')
    new_classes = new_classes.replace('bg-zinc-900', 'bg-[var(--bg-color)]')
    new_classes = new_classes.replace('text-white', 'text-[var(--text-primary)]')
    
    return new_classes

# Regex to find: ${isDarkMode ? "..." : "..."}
# Wait, some might span multiple lines if formatted differently, but in our code it's on one line.
content = re.sub(r'\$\{isDarkMode \? "([^"]+)" : "([^"]+)"\}', replacer, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modal refactored!")
