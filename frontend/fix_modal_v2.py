import re

file_path = r"e:\project\AI-Business-Analytics-Dashboard\AI-Business-Analytics-Dashboard\frontend\components\datasets\RemoteImportModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    r'text-white': r'text-[var(--text-primary)]',
    r'text-zinc-200': r'text-[var(--text-primary)]',
    r'text-zinc-350': r'text-[var(--text-secondary)]',
    r'text-zinc-400': r'text-[var(--text-secondary)]',
    r'text-zinc-500': r'text-[var(--text-secondary)]',
    r'text-zinc-550': r'text-[var(--text-secondary)]',
    r'text-zinc-555': r'text-[var(--text-secondary)]',
    
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

def replacer(match):
    dark_str = match.group(1)
    new_str = dark_str
    for old, new in replacements.items():
        new_str = re.sub(rf'\b{re.escape(old)}(?![/\w-])', new, new_str)
        
    # Catch any leftovers just in case
    new_str = new_str.replace('bg-zinc-950', 'bg-[var(--card-color)]')
    new_str = new_str.replace('bg-zinc-900', 'bg-[var(--bg-color)]')
    new_str = new_str.replace('text-white', 'text-[var(--text-primary)]')
    
    return new_str

content = re.sub(r'\$\{\s*isDarkMode\s*\?\s*"([^"]+)"\s*:\s*"[^"]+"\s*\}', replacer, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modal refactored successfully!")
