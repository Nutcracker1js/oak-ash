$replacements = @{
  'â˜°' = '&#9776;'
  'â™¡' = '&#9825;'
  'Ã—' = '&times;'
  'â†’' = '&rarr;'
  'â†' = '&larr;'
  'â€”' = '&mdash;'
  'â€“' = '&ndash;'
  'â€™' = '&rsquo;'
  'â€œ' = '&ldquo;'
  'â€' = '&rdquo;'
  'â‚¦' = '₦'
  'âœ‰' = '✓'
  'â€¢' = '•'
}
Get-ChildItem -Path . -Filter *.html | ForEach-Object {
  $path = $_.FullName
  $content = Get-Content -Path $path -Raw -Encoding UTF8
  $updated = $false
  foreach ($key in $replacements.Keys) {
    if ($content -like "*${key}*") {
      $content = $content -replace [regex]::Escape($key), $replacements[$key]
      $updated = $true
    }
  }
  if ($updated) {
    Set-Content -Path $path -Value $content -Encoding UTF8
    Write-Output "UPDATED $($path)"
  }
}
