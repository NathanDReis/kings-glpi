# Script para limpar classes light theme restantes
$htmlFile = "d:/Documentos/01 - PROJETOS/MLK/MLK-Tecnologia-Orcamento/frontend/src/app/pages/public/landing-page/landing-page.component.html"

$content = Get-Content $htmlFile -Raw -Encoding UTF8

Write-Host "Limpando classes light theme restantes..." -ForegroundColor Cyan

# Substituições específicas para remover classes light conflitantes
$cleanups = @{
    # Remover classes light que conflitam com dark
    '\s+text-gray-900\s+' = ' '
    '\s+text-black\s+' = ' '
    '\s+bg-white\s+' = ' '
    '\s+bg-gray-50\s+' = ' '
    '\s+bg-gray-100\s+' = ' '
    '\s+border-gray-100\s+' = ' '
    '\s+border-gray-200\s+' = ' '
    '\s+hover:bg-gray-50\s+' = ' '
    '\s+hover:bg-gray-100\s+' = ' '
    '\s+focus:ring-gray-200\s+' = ' '
    '\s+focus:ring-gray-300\s+' = ' '
    '\s+text-gray-800\s+' = ' '
    '\s+text-gray-500\s+' = ' '
    
    # Remover md:dark: que ainda podem existir
    '\s+md:dark:hover:text-blue-500\s+' = ' md:hover:text-blue-500 '
    '\s+md:dark:hover:bg-transparent\s+' = ' md:hover:bg-transparent '
}

foreach ($pattern in $cleanups.Keys) {
    $replacement = $cleanups[$pattern]
    $oldContent = $content
    $content = $content -replace $pattern, $replacement
    if ($oldContent -ne $content) {
        Write-Host "Removido: $pattern" -ForegroundColor Yellow
    }
}

# Limpar espaços duplos que podem ter sido criados
$content = $content -replace '\s{2,}', ' '
$content = $content -replace 'class="\s+', 'class="'
$content = $content -replace '\s+"', '"'

Write-Host "`nLimpeza concluída!" -ForegroundColor Green
Set-Content $htmlFile -Value $content -Encoding UTF8 -NoNewline

Write-Host "Arquivo salvo!" -ForegroundColor Green
