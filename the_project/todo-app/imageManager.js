const axios = require('axios');
const fs = require('fs');
const path = require('path');

const directory = process.env.IMAGE_DIRECTORY;

const imagePath = path.join(directory, 'image.jpg');

const metadataPath = path.join(directory, 'metadata.json');

const TEN_MINUTES = Number(process.env.IMAGE_CACHE_TIME);

fs.mkdirSync(directory, { recursive: true });

async function downloadImage() {

    console.log("Downloading new image...");

    const response = await axios.get(
        process.env.IMAGE_URL,
        {
            responseType: 'stream'
        }
    );

    await new Promise((resolve, reject) => {

        const writer = fs.createWriteStream(imagePath);

        response.data.pipe(writer);

        writer.on('finish', resolve);

        writer.on('error', reject);

    });

    fs.writeFileSync(
        metadataPath,
        JSON.stringify({
            lastDownload: Date.now()
        })
    );

}

function imageExpired() {

    if (!fs.existsSync(imagePath))
        return true;

    if (!fs.existsSync(metadataPath))
        return true;

    const metadata = JSON.parse(
        fs.readFileSync(metadataPath)
    );

    return Date.now() - metadata.lastDownload > TEN_MINUTES;

}

async function ensureImage() {

    if (imageExpired()) {

        await downloadImage();

    }

}

module.exports = {

    ensureImage,

    imagePath

};