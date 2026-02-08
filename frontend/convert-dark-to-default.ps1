# Script para converter tema dark para padrão
# Remove classes light e converte dark: para padrão

$htmlFile = "d:/Documentos/01 - PROJETOS/MLK/MLK-Tecnologia-Orcamento/frontend/src/app/pages/public/landing-page/landing-page.component.html"

# Ler o conteúdo do arquivo
$content = Get-Content $htmlFile -Raw -Encoding UTF8

Write-Host "Iniciando conversão de tema dark para padrão..." -ForegroundColor Cyan

# Backup do arquivo original
$backupFile = $htmlFile + ".backup"
Copy-Item $htmlFile $backupFile -Force
Write-Host "Backup criado: $backupFile" -ForegroundColor Green

# Padrão de substituição: remover dark: e manter a classe
# Exemplo: "dark:bg-gray-900" -> "bg-gray-900"
# Exemplo: "bg-white dark:bg-gray-800" -> "bg-gray-800"

# Lista de substituições comuns (light -> dark equivalente)
$replacements = @{
    # Backgrounds
    'bg-white\s+dark:bg-gray-800' = 'bg-gray-800'
    'bg-white\s+dark:bg-gray-900' = 'bg-gray-900'
    'bg-white\s+dark:bg-\[#0004\]' = 'bg-[#0004]'
    'bg-gray-50\s+dark:bg-gray-800' = 'bg-gray-800'
    'bg-gray-100\s+dark:bg-gray-900' = 'bg-gray-900'
    'bg-gray-100\s+dark:bg-gray-700' = 'bg-gray-700'
    'bg-white\s+dark:bg-gray-700' = 'bg-gray-700'
    
    # Borders
    'border-gray-200\s+dark:border-gray-700' = 'border-gray-700'
    'border-gray-100\s+dark:border-gray-700' = 'border-gray-700'
    'border-gray-200\s+dark:border-gray-600' = 'border-gray-600'
    
    # Text colors
    'text-gray-900\s+dark:text-white' = 'text-white'
    'text-gray-800\s+dark:text-white' = 'text-white'
    'text-black\s+dark:text-white' = 'text-white'
    'text-gray-500\s+dark:text-gray-400' = 'text-gray-400'
    'text-gray-900\s+dark:text-gray-400' = 'text-gray-400'
    
    # Hover states
    'hover:bg-gray-50\s+dark:hover:bg-gray-700' = 'hover:bg-gray-700'
    'hover:bg-gray-100\s+dark:hover:bg-gray-700' = 'hover:bg-gray-700'
    'hover:bg-gray-100\s+dark:hover:bg-gray-800' = 'hover:bg-gray-800'
    
    # Focus states
    'focus:ring-gray-300\s+dark:focus:ring-gray-800' = 'focus:ring-gray-800'
    'focus:ring-gray-200\s+dark:focus:ring-gray-800' = 'focus:ring-gray-800'
    'focus:ring-gray-200\s+dark:focus:ring-gray-600' = 'focus:ring-gray-600'
}

# Aplicar substituições
foreach ($pattern in $replacements.Keys) {
    $replacement = $replacements[$pattern]
    $content = $content -replace $pattern, $replacement
    Write-Host "Substituído: $pattern -> $replacement" -ForegroundColor Yellow
}

# Remover prefixos dark: restantes (para casos não cobertos acima)
# Padrão: captura "dark:classe-qualquer" e substitui por "classe-qualquer"
$content = $content -replace '\s+dark:([a-zA-Z0-9\-\[\]#:\.]+)', ' $1'

Write-Host "`nConversão concluída!" -ForegroundColor Green
Write-Host "Salvando arquivo..." -ForegroundColor Cyan

# Salvar o arquivo modificado
Set-Content $htmlFile -Value $content -Encoding UTF8 -NoNewline

Write-Host "Arquivo salvo com sucesso!" -ForegroundColor Green
Write-Host "`nResumo:" -ForegroundColor Cyan
Write-Host "- Arquivo original: $htmlFile" -ForegroundColor White
Write-Host "- Backup: $backupFile" -ForegroundColor White
Write-Host "- Todas as classes dark: foram convertidas para padrão" -ForegroundColor White
