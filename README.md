# Simple crawler to find text on a site and output findings to CSV

Supports crawling entire site or **Ctrl+c** to exit any time during the crawl and it'll auto save what it's found so far.

Find out more with:

```
node index.js --help
```

## Install

```
git clone https://github.com/WildfireInternet/simple-text-search-crawler.git
cd simple-text-search-crawler
npm install
```

## Update

```
git pull
npm install
```

## Run example

```
node index.js --url "https://www.madfun.co.uk/" --search="Jumpking"
```

```
node index.js --url "https://www.madfun.co.uk/" --search="Jumpking" --output ./jumpking-out.csv --concurrency=10
```

More info found with `--help`
