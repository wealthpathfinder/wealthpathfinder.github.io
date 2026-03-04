# Clean up all HTML files
$files = Get-ChildItem "c:\Users\USER\Desktop\wealth path finder" -Filter *.html

foreach($file in $files) {
    Write-Host "Processing: $($file.Name)"
    
    # Read file
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Remove ad-placeholder divs (including newlines and whitespace)
    $content = $content -replace '(?s)\s*<div class="ad-placeholder">.*?</div>\s*', "`n"
    
    # Remove corrupted emoji characters - replace with proper unicode or remove
    # Pattern: ðŸ followed by characters that are part of the corrupted encoding
    $content = $content -replace 'ðŸ[^<]*', ''
    $content = $content -replace 'â†', '→'
    $content = $content -replace '[â][^a-zA-Z0-9<>]', ''
    $content = $content -replace '[ð][^<]*[»]', ''
    
    # Write back
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    
    Write-Host "  ✓ Cleaned"
}

Write-Host "Done!"
