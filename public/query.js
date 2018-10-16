var startDate = '2016/04/01 00:00';
var endDate = Date.now();
var frequency = '1d-avg';
var graph = "";

function queryDatabase(start, end, frequency, metric) {
    let payload = {
        start: start,
        end: end,
        frequency: frequency,
        metric: metric
    };
    $.ajax({
        url: "/database",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        async: true,
        success: function(resp) {
            FillGraphData(resp);
            AllowGraphDisplay();
            console.log(resp[0][0].dps[0]);
            //respObj._names
            //graphLoaded();
            //if (graph == "line") setTimeout(renderLineGraph.bind(null, resp), 500);
            //else if (graph == "circle") setTimeout(renderCirclePack.bind(null, resp), 500);
            //else if (graph == "aster") setTimeout(renderAsterPlot.bind(null, resp), 500);
        }
    });
}

function queryMetrics(){
    console.log("here");
    $.ajax({
        url: '/metrics',
        type: "GET",
        contentType: "application/json",
        async: true,
        success: function(resp) {
            let metrics = [];
            resp.forEach(element => {
                if (element.includes('kWh')) metrics.push(element);
            });
            queryDatabase(startDate, endDate, frequency, metrics)
        }
    });
}

$(queryMetrics());