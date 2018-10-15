var dataGathered = [];
function lineToggle()
{
    document.getElementById("content").innerHTML='<object type="text/html" data="/cdn/sliderGraph.html" height="100%" width="100%" ></object>';
    graph = "lineGraph";
}

function FillGraphData(resp)
{
    dataGathered = resp;
    //console.log(dataGathered);
}

function testData()
{
    console.log(dataGathered);
}

