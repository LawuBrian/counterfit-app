# PowerShell script to organize images into new folder structure
# Run this from the counterfit-website directory

Write-Host "Organizing images into new folder structure..." -ForegroundColor Green

# Create the new folder structure
$folders = @(
    "public/images/outerwear",
    "public/images/tops", 
    "public/images/bottoms",
    "public/images/footwear",
    "public/images/accessories",
    "public/images/hero",
    "public/images/collections"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force
        Write-Host "Created folder: $folder" -ForegroundColor Green
    }
}

# Move images to appropriate folders
$imageMoves = @{
    "public/resources/Luxury_jersey.jpeg" = "public/images/hero/"
    "public/resources/blackjacket.jpg" = "public/images/outerwear/"
    "public/resources/WHITEDUOCOLLECTION.jpg" = "public/images/tops/"
    "public/resources/DUONATURECAMOORBLACKWHITE MIX.jpeg" = "public/images/bottoms/"
    "public/resources/COMBOPANTSJACKET.jpeg" = "public/images/footwear/"
    "public/resources/SKULLCAP.jpg" = "public/images/accessories/"
    "public/resources/WHITEJACKET.jpeg" = "public/images/collections/"
    "public/resources/LUXURYJACKET.jpeg" = "public/images/collections/"
    "public/resources/group photo different jackets.jpg" = "public/images/collections/"
    "public/resources/Coverimageblackjacketwithtie.jpg" = "public/images/collections/"
}

Write-Host "Moving images to new folders..." -ForegroundColor Yellow

foreach ($move in $imageMoves.GetEnumerator()) {
    $source = $move.Key
    $destination = $move.Value
    
    if (Test-Path $source) {
        $filename = Split-Path $source -Leaf
        $destPath = Join-Path $destination $filename
        
        try {
            Copy-Item $source $destPath -Force
            Write-Host "Moved: $filename to $destination" -ForegroundColor Green
        } catch {
            Write-Host "Failed to move: $filename" -ForegroundColor Red
        }
    } else {
        Write-Host "Source not found: $source" -ForegroundColor Yellow
    }
}

Write-Host "Image organization complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Review the moved images in the new folders" -ForegroundColor White
Write-Host "   2. Update the code to use the new image paths" -ForegroundColor White
Write-Host "   3. Test the website to ensure all images load correctly" -ForegroundColor White
