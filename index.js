var Crawler = require('simplecrawler');
var cheerio = require('cheerio');
var fs = require('fs');
var GetUniqueSelector = require('cheerio-get-css-selector');
var { convertArrayToCSV } = require('convert-array-to-csv');

var crawler = new Crawler('https://www.madfun.co.uk/');
crawler.maxConcurrency = 4;

var rows = [
    ['url', 'text', 'css selector'],
];

crawler.on('fetchcomplete', function (queueItem, responseBuffer, response) {
    var url = queueItem.url,
        html = responseBuffer.toString(),
        $ = cheerio.load(html),
        $found;

    GetUniqueSelector.init($);

    $found = $('p:contains("Jumpking"), span:contains("Jumpking")');

    if ($found.length) {
        console.log('Found on: ', url);
        rows.push([url, $found.text(), $found.getUniqueSelector()]);
    }
});

crawler.on('complete', function () {

    console.log('Crawl Complete');

    console.log('Writing to CSV');
    convertArrayToCSV(rows);

});

process.on('SIGINT', (code) => {
    console.log('Crawl exited early');
    crawler.stop();

    console.log('Writing to CSV: ./jumpking-out.csv');
    fs.writeFileSync('./jumpking-out.csv', convertArrayToCSV(rows));
});

crawler.start();
