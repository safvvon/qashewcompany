import Jimp from 'jimp';

async function checkBg(filepath) {
    const img = await Jimp.read(filepath);
    const pixel = img.getPixelColor(0, 0); // top-left corner
    const rgba = Jimp.intToRGBA(pixel);
    console.log(`File: ${filepath}`);
    console.log(`Top-left pixel:`, rgba);
}

checkBg('public/images/falling_cashew.png');
checkBg('public/cashew_luxury_box.png');
