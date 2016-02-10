$(function test() {
    chart = new Highcharts.Chart({
        chart: { renderTo: 'cont' },
        title: { text: 'Monthly Average Temperature' },
        exporting: {
            enabled: false
        },
        subtitle: { text: 'Source: WorldClimate.com' },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']},
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }]
    });

    //on prend la charte, on la transforme en svg
    var svg = chart.getSVG();
    var t= "maria";

    //et on la balance sur le serveur
    $.ajax({
        type: 'POST',
        url: 'pdf/rapportEcophileSvg.php',
        data: {test  : svg} //le code "texte" du svg


    });
});