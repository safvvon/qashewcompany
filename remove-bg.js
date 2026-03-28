const { Jimp } = require('jimp');

async function removeWhiteBg(inPath, outPath) {
    console.log(`Processing ${inPath}...`);
    const img = await Jimp.read(inPath);
    
    // We will do a generic flood fill or color distance threshold
    // For every pixel, if it's close to white, make it transparent
    
    img.scan((x, y, idx) => {
        const r = img.bitmap.data[idx + 0];
        const g = img.bitmap.data[idx + 1];
        const b = img.bitmap.data[idx + 2];
        
        // White threshold
        if (r > 200 && g > 200 && b > 200) {
            // Also add a simple feathering based on how close to white it is
            // 255 -> alpha 0
            // 200 -> alpha 255
            const brightness = (r + g + b) / 3;
            // scale 200-255 to 255-0
            let alpha = 255 - ((brightness - 200) * (255 / 55));
            if (alpha < 0) alpha = 0;
            if (alpha > 255) alpha = 255;
            
            // To prevent white halos, we might also darken the halo
            img.bitmap.data[idx + 3] = alpha;
        }
    });

    await img.write(outPath);
    console.log(`Saved ${outPath}`);
}

async function removeBlackBg(inPath, outPath) {
    console.log(`Processing ${inPath}...`);
    const img = await Jimp.read(inPath);
    
    img.scan((x, y, idx) => {
        const r = img.bitmap.data[idx + 0];
        const g = img.bitmap.data[idx + 1];
        const b = img.bitmap.data[idx + 2];
        
        // Black/Dark threshold
        if (r < 40 && g < 40 && b < 40) {
            const brightness = (r + g + b) / 3;
            // 0 -> alpha 0
            // 40 -> alpha 255
            let alpha = brightness * (255 / 40);
            if (alpha < 0) alpha = 0;
            if (alpha > 255) alpha = 255;
            
            img.bitmap.data[idx + 3] = alpha;
        }
    });

    await img.write(outPath);
    console.log(`Saved ${outPath}`);
}

async function run() {
    await removeWhiteBg('public/images/falling_cashew.png', 'public/images/falling_cashew.png');
    await removeBlackBg('public/cashew_luxury_box.png', 'public/cashew_luxury_box.png');
}

run().catch(console.error);
