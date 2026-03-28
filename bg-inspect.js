const { Jimp } = require('jimp');

async function checkBg(filepath) {
    try {
        const img = await Jimp.read(filepath);
        const pixel = img.getPixelColor(0, 0); // top-left corner
        console.log(`File: ${filepath}`);
        console.log(`Top-left pixel HEX:`, pixel.toString(16));
    } catch (e) {
        console.error(e);
    }
}

checkBg('public/raw_single_cashew.png').catch(console.error);
