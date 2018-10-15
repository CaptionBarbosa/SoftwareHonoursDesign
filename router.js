var mQuery = require('opentsdb-mquery')(),
    client = require('opentsdb-client')(),
    path = require("path"),
    express = require("express");

client
    .host('35.242.175.172')
    .port(4242)
    .ms(true)
    .arrays(true)
    .tsuids(false)
    .annotations('all')

var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', '/index.html'));
});

router.post("/database", function (req, res) {
    console.log("In POST request");
    let start = req.body.start;
    let end = req.body.end;
    let frequency = req.body.frequency;
    let metric = req.body.metric;
    let result = [];

    if(!start || !end || !frequency || !metric)
    {
        return res.sendStatus(400);
    }

    for(let metricIndex = 0; metricIndex < metric.length; metricIndex++)
    {
        mQuery
            .aggregator('avg')
            .downsample(frequency)
            .rate(false)
            .metric(metric[metricIndex])
            .tags('DataLoggerName', metric[metricIndex])

        client
            .start(start)
            .end(end)
            .queries(mQuery)
            .get(function onData(error, data) {
                if (error) {
                    console.error(JSON.stringify(error));
                    return;
                }
                //console.log(data);
                result.push(data);
                if (result.length == metric.length) {
                    res.send(result);
                }
            });
    }
});

router.get('/metrics', function(req, res) {
    console.log("In GET request");
    client.metrics(function onResponse(error, metrics) {
        if(error) {
            console.error(JSON.stringify(error));
            return;
        }
        //console.log(metrics);
        res.send(metrics);
    })
})

module.exports = router;
