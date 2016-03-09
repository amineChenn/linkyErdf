/**
 * Created by Amine on 30/01/2016.
 */

$(function () {
    Highcharts.setOptions({
        global : {
            useUTC : false
        },
        lang: {
            months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
            weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi',
                'Jeudi', 'Vendredi', 'Samedi'],
            shortMonths: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil',
                'Aout', 'Sept', 'Oct', 'Nov', 'Déc'],
            decimalPoint: ',',
            downloadPNG: 'Télécharger en image PNG',
            downloadJPEG: 'Télécharger en image JPEG',
            downloadPDF: 'Télécharger en document PDF',
            downloadSVG: 'Télécharger en document Vectoriel',
            exportButtonTitle: 'Export du graphique',
            loading: 'Chargement en cours...',
            printButtonTitle: 'Imprimer le graphique',
            resetZoom: 'Réinitialiser le zoom',
            resetZoomTitle: 'Réinitialiser le zoom au niveau 1:1',
            thousandsSep: ' ',
            decimalPoint: ','
        }
    });

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() -1 );
    $('.dateEndAvanceePeriod').datepicker("setDate", new Date());
    $('.dateStartAvanceePeriod').datepicker("setDate", yesterday);

    $('#dateStartAvancee').on('changeDate', function () {
        $('.datepicker').hide();
        document.getElementById('powerPeriodCharts').style.display = "none";
        document.getElementById('spinnerPeriodAdvanced').style.display = "block";
        getPowerPeriod();
    });

    $('#dateEndAvancee').on('changeDate', function () {
        $('.datepicker').hide();
        document.getElementById('powerPeriodCharts').style.display = "none";
        document.getElementById('spinnerPeriodAdvanced').style.display = "block";
        getPowerPeriod();
    });

    $.getJSON("conf.json", function (data) {
        var url = data["url"];
        var port = data["port"];
        var projectDirectory = data["projectDirectory"];
        var api = data["api"];
        $.ajax({
            type: "GET",
            url: url + ":" + port + "/" + projectDirectory + "/" + api + "/SelectLastRangeData/Values",
            dataType: 'json',
            success: function (data) {
                if (data.length !== 0) {
                    livePower(data);
                } else {
                    //TODO message d'erreur
                }
            },
            error: function() {
                document.getElementById('spinnerPeriodAdvanced').style.display = "none";
                document.getElementById("#errorMessageConnection").style.display = "block";
            }
        });
    });

});


function livePower (dataBase) {
    document.getElementById('spinnerLiveAdvanced').style.display = "none";
    // Create the chart
    $('#courbeTension').highcharts('StockChart', {
        chart: {
            type: 'spline',
            events: {
                load: function () {
                    var series = this.series[0];
                    setInterval(function () {
                        var liveData =  JSON.parse(getLiveData());
                        var x = new Date(liveData[0].Date).getTime(), // current time
                            y = parseInt(liveData[0].Tension);
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },
        xAxis: {
            ordinal: false,
            type: 'datetime'
        },

        navigator: {
            adaptToUpdatedData: true
        },

        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1min'
            }, {
                count: 5,
                type: 'minute',
                text: '5min'
            }, {
                type: 'all',
                text: 'Tout'
            }],
            inputEnabled: false,
            selected: 0
        },

        title: {
            text: 'Tension'
        },

        exporting: {
            enabled: false
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            min:0,
            max: 500,
            plotLines:[{
                value:400,
                color: '#ff0000',
                width:2,
                zIndex:4,
                //label:{text:'goal'}
            },{
                value:10,
                color: '#ff0000',
                width:2,
                zIndex:4,
                //label:{text:'goal'}
            }]
        },

        series: [{
            name: 'Tension',
            data: (function () {
                var data = [], i;
                for (i = 0; i < dataBase.length; i += 1) {
                    data.push([
                        new Date(dataBase[i].Date).getTime(),
                        parseInt(dataBase[i].Tension)
                    ]);
                }
                return data;
            }())
        }]
    });
}


function powerPeriod (dataBase) {
    document.getElementById('spinnerPeriodAdvanced').style.display = "none";
    document.getElementById('powerPeriodCharts').style.display = "block";
    // Create the chart
    //TODO init with yesterday and today
    $('#courbeTensionPeriod').highcharts('StockChart', {
        chart: {
            type: 'spline',
            events: {
                load: function () {
                    this.series[0];
                }
            }
        },
        xAxis: {
            ordinal: false,
            type: 'datetime'
        },

        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1min'
            }, {
                count: 5,
                type: 'minute',
                text: '5min'
            }, {
                type: 'all',
                text: 'Tout'
            }],
            inputEnabled: false,
            selected: 5
        },

        title: {
            text: 'Tension'
        },

        exporting: {
            enabled: false
        },

        yAxis: {
            max: 300
        },

        plotOptions:{
            series:{
                turboThreshold:0
            }
        },

        series: [{
            name: 'Tension',
            data: (function () {
                var data = [], i;
                for (i = 0; i < dataBase.length; i += 1) {
                    data.push([
                        new Date(dataBase[i].Date).getTime(),
                        parseInt(dataBase[i].Tension)
                    ]);
                }
                return data;
            }())
        }]
    });
}

var url;
var port;
var projectDirectory;
var api;

$.getJSON("conf.json", function (data) {
    url = data["url"];
    port = data["port"];
    projectDirectory = data["projectDirectory"];
    api = data["api"];
});

function getPowerPeriod() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById('spinnerPeriodAdvanced').style.display = "none";
        document.getElementById("#errorMessageDate").style.display = "block";
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
    }
    else {
        //TODO query

        if (dateStart != null && dateEnd != null) {
            var curr_date = dateStart.getDate();
            var curr_month = dateStart.getMonth() + 1; //Months are zero based
            var curr_year = dateStart.getFullYear();
            dateStart = curr_year + "-" + curr_month + "-" + curr_date;

            var curr_date = dateEnd.getDate() + 1;
            var curr_month = dateEnd.getMonth() + 1; //Months are zero based
            var curr_year = dateEnd.getFullYear();
            dateEnd = curr_year + "-" + curr_month + "-" + curr_date;


            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api + '/SelectByDate/Values?date1=' + dateStart + '&date2=' + dateEnd,
                //url: 'http://192.168.0.100:9084/projetERDF/api.php/SelectByDate/Values?date1=2010-08-06 03:27:40&date2=2010-08-06 03:28:00',
                dataType: 'json',
                success: function (data) {
                    if (data[0] !== null) {
                        powerPeriod(data);
                    } else {
                        document.getElementById('spinnerPeriodAdvanced').style.display = "none";
                        document.getElementById("#errorEmptyData").style.display = "block";
                        $(".alert").delay(4000).slideUp(500, function() {
                            document.getElementById("#errorEmptyData").style.display = "none";
                        });
                    }
                },
                error: function() {
                    document.getElementById('spinnerPeriodAdvanced').style.display = "none";
                    document.getElementById("#errorMessageConnection").style.display = "block";
                    $(".alert").delay(4000).slideUp(500, function() {
                        document.getElementById("#errorMessageConnection").style.display = "none";
                    });
                }
            });

        }
    }
}

function getLiveData () {
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api + "/SelectLastRow/Values",
        dataType: 'json',
        async: false,
        success: function (data) {
            return data;
        },
        error: function() {
            document.getElementById('spinnerPeriodAdvanced').style.display = "none";
            document.getElementById("#errorMessageConnection").style.display = "block";
        }
    }).responseText;
}
