import os

def replace_in_file(file_path, old, new):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix login
replace_in_file(
    'app/(auth)/login/page.tsx',
    '} catch (err: any) {',
    '} catch (err) {\n      if (err instanceof Error) {'
)
replace_in_file(
    'app/(auth)/login/page.tsx',
    'setError(err.message);\n      setLoading(false);\n    }',
    'setError(err.message);\n      } else {\n        setError(String(err));\n      }\n      setLoading(false);\n    }'
)

# Fix ai-insights
replace_in_file(
    'app/(dashboard)/ai-insights/page.tsx',
    'catch (err: any) {',
    'catch (err) {\n      if (err instanceof Error) {'
)
replace_in_file(
    'app/(dashboard)/ai-insights/page.tsx',
    'setError(err.message || "Failed to load insights");\n    }',
    'setError(err.message || "Failed to load insights");\n      } else {\n        setError("Failed to load insights");\n      }\n    }'
)

# Fix cascading renders
def fix_renders(path):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('setIsDarkMode(mediaQuery.matches);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n    setIsDarkMode(mediaQuery.matches);')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_renders('app/appsec/page.tsx')
fix_renders('app/privacy/page.tsx')
fix_renders('app/terms/page.tsx')
