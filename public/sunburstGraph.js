//Initially sourced from Greg Venech - "Sunburst with Zooming and Breadcrumbs"
//Source - https://codepen.io/gvenech/pen/KppEaP
//Access: 19th October 2018
//Edited for usage by Alessandro Barbosa
function sunburstToggle()
{
    document.getElementById("contentSunburstGraph").innerHTML='<object type="text/html" data="/cdn/sunburstGraph.html" height="80%" width="100%" ></object>';
    document.getElementById("contentLineGraph").style.display = "none";
    document.getElementById('contentSunburstGraph').style.display = "block"
    graph = "sunburstGraph";
}