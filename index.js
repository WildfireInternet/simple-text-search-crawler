const Crawler = require('simplecrawler');
const cheerio = require('cheerio');
const fs = require('fs');
const GetUniqueSelector = require('cheerio-get-css-selector');
const { convertArrayToCSV } = require('convert-array-to-csv');
const meow = require('meow');

const cli = meow(`
    Usage
    $ node index.js --url "https://www.madfun.co.uk/" --search="Jumpking"

    Options
    --url, -u  URL to crawl
    --search, -s  Text to search for
    --out, -o  CSV putput file location, defaults to out.csv
    --help

    Examples
    $ node index.js --url "https://www.madfun.co.uk/" --search="Jumpking" --output ./jumpking-out.csv --concurrency=10
    `, {
    flags: {
        url: {
            isRequired: true,
            type: 'string',
            alias: 'u'
        },
        search: {
            isRequired: true,
            type: 'string',
            alias: 's'
        },
        output: {
            type: 'string',
            alias: 'o',
            default: './out.csv'
        },
        concurrency: {
            type: 'number',
            alias: 'c',
            default: 25
        }
    }
});

let crawler = new Crawler(cli.flags.url);
crawler.maxConcurrency = cli.flags.concurrency;

let rows = [
    ['url', 'text', 'css selector'],
];

let searchTerm = cli.flags.search.replace(/"/, '\"');
console.log('Crawling', cli.flags.url, 'for:', searchTerm);

crawler.on('fetchcomplete', function (queueItem, responseBuffer, response) {
    let url = queueItem.url,
        html = responseBuffer.toString(),
        $ = cheerio.load(html),
        $found;

    GetUniqueSelector.init($);

    $found = $('p:contains("' + searchTerm + '"), span:contains("' + searchTerm + '")');

    if ($found.length) {
        console.log('Found on: ', url);
        rows.push([url, $found.text(), $found.getUniqueSelector()]);
    }
});

function writeOutputFile() {
    console.log('Writing to CSV:', cli.flags.output);
    fs.writeFileSync(cli.flags.output, convertArrayToCSV(rows));
}

crawler.on('complete', function () {
    console.log('Crawl complete');
    writeOutputFile();
});

process.on('SIGINT', (code) => {
    console.log('Crawl exited early');
    crawler.stop();
    writeOutputFile();
});

crawler.start();
