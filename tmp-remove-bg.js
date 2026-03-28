const { Jimp } = require('jimp');

async function removeBg() {
    const inPath = 'public/raw_single_cashew.png';
    const outPath = 'public/raw_single_cashew.png';
    console.log(`Processing ${inPath}...`);
    const img = await Jimp.read(inPath);
    
    // Check top-left pixel to guess background
    const r0 = img.bitmap.data[0];
    const g0 = img.bitmap.data[1];
    const b0 = img.bitmap.data[2];
    
    const isWhiteBg = r0 > 200 && g0 > 200 && b0 > 200;
    const isBlackBg = r0 < 40 && g0 < 40 && b0 < 40;
    
    console.log(`Detected bg: r:${r0} g:${g0} b:${b0} (White: ${isWhiteBg}, Black: ${isBlackBg})`);

    img.scan((x, y, idx) => {
        const r = img.bitmap.data[idx + 0];
        const g = img.bitmap.data[idx + 1];
        const b = img.bitmap.data[idx + 2];
        const brightness = (r + g + b) / 3;

        if (isWhiteBg) {
            if (r > 200 && g > 200 && b > 200) {
                let alpha = 255 - ((brightness - 200) * (255 / 55));
                if (alpha < 0) alpha = 0;
                if (alpha > 255) alpha = 255;
                img.bitmap.data[idx + 3] = alpha;
            }
        } else if (isBlackBg) {
             if (r < 40 && g < 40 && b < 40) {
                let alpha = brightness * (255 / 40);
                if (alpha < 0) alpha = 0;
                if (alpha > 255) alpha = 255;
                img.bitmap.data[idx + 3] = alpha;
            }
        }
    });

    await img.write(outPath);
    console.log(`Saved ${outPath}`);
}

removeBg().catch(console.error);
