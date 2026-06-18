import re

files = [
    r"e:\project\AI-Business-Analytics-Dashboard\AI-Business-Analytics-Dashboard\frontend\app\(dashboard)\datasets\page.tsx",
    r"e:\project\AI-Business-Analytics-Dashboard\AI-Business-Analytics-Dashboard\frontend\components\datasets\FolderTree.tsx",
    r"e:\project\AI-Business-Analytics-Dashboard\AI-Business-Analytics-Dashboard\frontend\components\datasets\DatasetDetailsView.tsx"
]

replacements = {
    r'text-white': r'text-[var(--text-primary)]',
    r'text-zinc-200': r'text-[var(--text-primary)]',
    r'text-zinc-250': r'text-[var(--text-primary)]',
    r'text-zinc-300': r'text-[var(--text-secondary)]',
    r'text-zinc-350': r'text-[var(--text-secondary)]',
    r'text-zinc-400': r'text-[var(--text-secondary)]',
    r'text-zinc-450': r'text-[var(--text-secondary)]',
    r'text-zinc-500': r'text-[var(--text-secondary)]',
    r'text-zinc-550': r'text-[var(--text-secondary)]',
    r'text-zinc-555': r'text-[var(--text-secondary)]',
    r'text-zinc-600': r'text-[var(--text-secondary)]',
    r'text-zinc-650': r'text-[var(--text-secondary)]',
    r'text-zinc-700': r'text-[var(--text-secondary)]',
    r'text-zinc-800': r'text-[var(--text-secondary)]',
    
    r'bg-zinc-950/10': r'bg-[var(--card-color)]',
    r'bg-zinc-950/20': r'bg-[var(--card-color)]',
    r'bg-zinc-950/30': r'bg-[var(--card-color)]',
    r'bg-zinc-950/40': r'bg-[var(--card-color)]',
    r'bg-zinc-950/45': r'bg-[var(--card-color)]',
    r'bg-zinc-950/65': r'bg-[var(--card-color)]',
    r'bg-zinc-950/80': r'bg-[var(--card-color)]',
    r'bg-zinc-950': r'bg-[var(--card-color)]',
    
    r'bg-zinc-900/10': r'bg-[var(--bg-color)]',
    r'bg-zinc-900/40': r'bg-[var(--bg-color)]',
    r'bg-zinc-900/50': r'bg-[var(--bg-color)]',
    r'bg-zinc-900/60': r'bg-[var(--bg-color)]',
    r'bg-zinc-900/65': r'bg-[var(--bg-color)]',
    r'bg-zinc-900': r'bg-[var(--bg-color)]',
    
    r'bg-zinc-850/80': r'bg-[var(--border-color)]',
    r'bg-zinc-800/80': r'bg-[var(--border-color)]',
    r'bg-zinc-850': r'bg-[var(--bg-color)]',
    r'bg-zinc-800': r'bg-[var(--bg-color)]',
    
    r'border-zinc-900/20': r'border-[var(--border-color)]',
    r'border-zinc-900/40': r'border-[var(--border-color)]',
    r'border-zinc-900/60': r'border-[var(--border-color)]',
    r'border-zinc-900': r'border-[var(--border-color)]',
    
    r'border-zinc-850/40': r'border-[var(--border-color)]',
    r'border-zinc-850/50': r'border-[var(--border-color)]',
    r'border-zinc-850': r'border-[var(--border-color)]',
    
    r'border-zinc-800/80': r'border-[var(--border-color)]',
    r'border-zinc-800': r'border-[var(--border-color)]',
    
    r'hover:bg-zinc-900/50': r'hover:bg-[var(--bg-color)]',
    r'hover:bg-zinc-900/65': r'hover:bg-[var(--bg-color)]',
    r'hover:bg-zinc-900': r'hover:bg-[var(--bg-color)]',
    
    r'hover:bg-zinc-850/80': r'hover:bg-[var(--card-color)]',
    r'hover:bg-zinc-850': r'hover:bg-[var(--card-color)]',
    
    r'hover:bg-zinc-800/80': r'hover:bg-[var(--border-color)]',
    r'hover:bg-zinc-800': r'hover:bg-[var(--border-color)]',
    
    r'hover:border-zinc-850/50': r'hover:border-[var(--brand-primary)]',
    r'hover:border-zinc-850': r'hover:border-[var(--brand-primary)]',
    
    r'hover:border-zinc-800': r'hover:border-[var(--brand-primary)]',
    r'hover:border-zinc-750': r'hover:border-[var(--brand-primary)]',
    r'hover:border-zinc-700': r'hover:border-[var(--brand-primary)]',
    
    r'placeholder-zinc-600': r'placeholder-[var(--text-secondary)]',
    r'placeholder-zinc-550': r'placeholder-[var(--text-secondary)]',
    
    r'hover:text-white': r'hover:text-[var(--text-primary)]',
    r'hover:text-zinc-200': r'hover:text-[var(--text-primary)]',
    r'hover:text-zinc-300': r'hover:text-[var(--text-primary)]',
    r'bg-[#0d111d]/10': r'bg-[var(--bg-color)]'
}

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements.items():
        if '[' in old or ']' in old:
             content = content.replace(old, new)
        else:
             # Negative lookahead/behind to ensure we don't partially replace tailwind classes
             content = re.sub(rf'\b{re.escape(old)}(?![/\w-])', new, content)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Replacements complete!")
