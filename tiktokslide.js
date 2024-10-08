const axios = require('axios');
const cheerio = require('cheerio');

async function ttslide(url) {
try {
const response = await axios.post('https://ttsave.app/download', {
query: url,
language_id: '2'
},
{
headers: {
'Accept': 'application/json, text/plain, */*',
'Content-Type': 'application/json'
}
})

const html = response.data
const $ = cheerio.load(html)

const uniqueId = $('#unique-id').val()
const username = $('h2.font-extrabold.text-xl.text-center').text()
const thumbnail = $('a[target="_blank"]').attr('href')
const profile = $('img.h-24.w-34.rounded-full').attr('src')
const description = $('p.text-gray-600.px-2.text-center.break-all.w-3/4.oneliner').text()

const stats = {
views: $('svg.h-5.w-5.text-gray-500 + span').text(),
likes: $('svg.h-5.w-5.text-red-500 + span').text(),
comments: $('svg.h-5.w-5.text-green-500 + span').text(),
shares: $('svg.h-5.w-5.text-yellow-500 + span').text(),
downloads: $('svg.h-5.w-5.text-blue-500 + span').text()
}

const download = []
$('a[onclick="bdl(this, event)"]').each((i, elem) => {
const link = $(elem).attr('href')
const type = $(elem).attr('type')
const title = $(elem).text().trim()
download.push({ link, type, title })
})

return {
status: true,
creator: 'SuryaDev',
uniqueId,
username,
thumbnail,
profile,
description,
stats,
download,
};
} catch (e) {
return {
status: false,
creator: 'SuryaDev',
message: String(e)
};
}
}

module.exports = ttslide;