$root = "c:\Users\USER\Desktop\wealth path finder"
Get-ChildItem -Path $root -Filter *.html -Recurse | ForEach-Object {
    $path = $_.FullName
    Copy-Item -LiteralPath $path -Destination ($path + '.bak') -Force
    (Get-Content -LiteralPath $path -Raw) -replace '2024','2025' | Set-Content -LiteralPath $path -Encoding utf8
    Write-Output "Updated: $path"
}