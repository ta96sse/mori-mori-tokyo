// scripts/fetch-data.js
const fs = require('fs');
const path = require('path');

// 既存のGASのエンドポイントURL
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycby7w5D6cz33RjC5uMnh-_kfgKVIRXe6mn_kG_W2QRjUKNJaq3VVHbqSqP0Soz-p_nXp/exec';
const OUTPUT_PATH = path.join(__dirname, '../assets/data.json');

async function main() {
    console.log('Fetching data from GAS...');
    try {
        const response = await fetch(GAS_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // 整形など必要なければそのまま保存
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
        console.log(`Data saved to ${OUTPUT_PATH}`);

    } catch (error) {
        console.error('Failed to fetch data:', error);
        process.exit(1);
    }
}

main();