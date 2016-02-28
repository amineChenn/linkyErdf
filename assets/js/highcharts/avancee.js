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
        document.getElementById('advancedPeriodCharts').style.display = "none";
        document.getElementById('spinnerPeriodAdvanced').style.display = "block";
        getRelativeAdvancedPeriod();
    });

    $('#dateEndAvancee').on('changeDate', function () {
        $('.datepicker').hide();
        document.getElementById('spinnerPeriodAdvanced').style.display = "block";
        getRelativeAdvancedPeriod();
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
                    courbeRelatedAdvanced(data);
                    courbeActiveAdvanced (data);
                } else {
                    //TODO message d'erreur
                    console.log("Erreur : impossible de récupérer Papparente ou Date");
                }
            },
            error: function() {
                document.getElementById('spinnerPeriodAdvanced').style.display = "none";
                document.getElementById("#errorMessageConnection").style.display = "block";
            }
        });
    });

});

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

function courbeRelatedAdvanced (dataBase) {
    document.getElementById('spinnerLiveAdvanced').style.display = "none";
    // Create the chart
    $('#courbeRelatedAdvanced').highcharts('StockChart', {
        chart: {
            type: 'spline',
            events: {
                load: function () {
                    var series = this.series[0];
                    setInterval(function () {
                            var liveData =  JSON.parse(getLiveData());
                            var x = new Date(liveData[0].Date).getTime(), // current time
                                y = parseInt(liveData[0].Papparente);
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
            text: 'Puissance apparente'
        },

        exporting: {
            enabled: false
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            max: 1000,
            tickInterval: 50,
            plotLines: [{
                value: 400,
                color: '#000000',
                width: 2,
                zIndex: 4,
                label: {text: 'Maximum souscrit'}
            }]
        },

        series: [{
            name: 'Random data',
            data: (function () {
                var data = [], i;
                for (i = 0; i < dataBase.length; i += 1) {
                    data.push([
                        new Date(dataBase[i].Date).getTime(),
                        parseInt(dataBase[i].Papparente)
                    ]);
                }
                return data;
            }())
        }]
    });
}

function courbeActiveAdvanced (dataBase) {
    document.getElementById('spinnerLiveAdvanced').style.display = "none";
    // Create the chart
    $('#courbeActiveAdvanced').highcharts('StockChart', {
        chart: {
            type: 'column',
            events: {
                load: function () {
                    var series = this.series[0];
                    setInterval(function () {
                        var liveData =  JSON.parse(getLiveData());
                        if (liveData[0].Pactive !== null) {
                            console.log("date = " , liveData[0].Date);
                            console.log("pactive = " , liveData[0].Pactive);
                            var x = new Date(liveData[0].Date).getTime(), // current time
                                y = parseInt(liveData[0].Pactive);
                            series.addPoint([x, y], true, true);
                        }
                    }, 1000);
                }
            }
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
            text: 'Puissance active'
        },

        exporting: {
            enabled: false
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            name: 'Puissance active en VA',
            data: (function () {
                var data = [], i;
                for (i = 0; i < dataBase.length; i += 1) {
                    if (dataBase[i].Pactive !== null) {
                        data.push([
                            new Date(dataBase[i].Date).getTime(),
                            parseInt(dataBase[i].Pactive)
                        ]);
                    }
                }
                return data;
            }())
        }]
    });
}

function courbeRelativeAdvancedPeriod (dataBase) {
    document.getElementById('spinnerPeriodAdvanced').style.display = "none";
    document.getElementById('advancedPeriodCharts').style.display = "block";
    // Create the chart
    //TODO init with yesterday and today
        $('#courbeRelativeAdvancedPeriod').highcharts('StockChart', {
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
                text: 'Puissance apparente en VA'
            },

            exporting: {
                enabled: false
            },

            yAxis: {
                tickInterval: 50,
                title: {
                    text: 'VA'
                },
                plotLines: [{
                    value: 400,
                    color: '#000000',
                    width: 2,
                    zIndex: 4,
                    label: {text: 'Maximum souscrit'}
                }]
            },

            plotOptions:{
                series:{
                    turboThreshold:0
                }
            },

            series: [{
                name: 'Puissance Apparente',
                data: (function () {
                    var data = [], i;
                    for (i = 0; i < dataBase.length; i += 1) {
                            data.push([
                                new Date(dataBase[i].Date).getTime(),
                                parseInt(dataBase[i].Papparente)
                            ]);
                    }
                    return data;
                }())
            }]
        });
}

function courbeActiveAdvancedPeriod (dataBase) {
    document.getElementById('spinnerPeriodAdvanced').style.display = "none";
    document.getElementById('advancedPeriodCharts').style.display = "block";
    //TODO init with yesterday and today
    $('#courbeActiveAdvancedPeriod').highcharts('StockChart', {
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
            text: 'Puissance active en VA'
        },

        exporting: {
            enabled: false
        },

        plotOptions:{
            series:{
                turboThreshold:0
            }
        },

        series: [{
            name: 'Puissance Active',
            data: (function () {
                var data = [], i;
                for (i = 0; i < dataBase.length; i += 1) {
                    if (dataBase[i].Pactive !== null) {
                        data.push([
                            new Date(dataBase[i].Date).getTime(),
                            parseInt(dataBase[i].Pactive)
                        ]);
                    }
                }
                return data;
            }())
        }]
    });
}

function getRelativeAdvancedPeriod() {

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
        console.log("la date de fin doit etre avant la date de debut");
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

            console.log("DATE START = ", dateStart);
            console.log("DATE END = ", dateEnd);

            $.ajax({
                type: "GET",
                url: url + ":" + port + "/" + projectDirectory + "/" + api + '/SelectByDate/Values?date1=' + dateStart + '&date2=' + dateEnd,
                //url: 'http://192.168.0.100:9084/projetERDF/api.php/SelectByDate/Values?date1=2010-08-06 03:27:40&date2=2010-08-06 03:28:00',
                dataType: 'json',
                success: function (data) {
                    if (data[0] !== null) {
                        console.log("Data = ",data);
                        courbeRelativeAdvancedPeriod(data);
                        courbeActiveAdvancedPeriod (data);
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