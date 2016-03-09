/**
 * Created by Amine on 30/01/2016.
 */

var url = "";
var port = "";
var projectDirectory = "";
var api = "";
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
        document.getElementById('wattPeriodCharts').style.display = "none";
        document.getElementById('spinnerPeriodAdvanced').style.display = "block";
        getPowerPeriod();
        getSelectedMode();
    });

    $('#dateEndAvancee').on('changeDate', function () {
        $('.datepicker').hide();
        document.getElementById('wattPeriodCharts').style.display = "none";
        document.getElementById('spinnerPeriodAdvanced').style.display = "block";
        getPowerPeriod();
        getSelectedMode();
    });

    //TODO modifier mode pour le reste (variable globale)
    $('#selectedMode').change(function () {
        document.getElementById('wattPeriodCharts').style.display = "none";
        document.getElementById('spinnerPeriodAdvanced').style.display = "block";
        getSelectedMode();
        document.getElementById('spinnerPeriodAdvanced').style.display = "none";
        document.getElementById('wattPeriodCharts').style.display = "block";
    });

    $.getJSON("conf.json", function (data) {
        url = data["url"];
        port = data["port"];
        projectDirectory = data["projectDirectory"];
        api = data["api"];
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
    $('#courbeKwh').highcharts('StockChart', {
        chart: {
            type: 'spline',
            events: {
                load: function () {
                    var series = this.series[0];
                    setInterval(function () {
                        var liveData =  JSON.parse(getLiveData());
                        if (liveData[0] !== null) {
                            var x = new Date(liveData[0].Date).getTime(), // current time
                                y = parseFloat(liveData[0].Energie);
                            series.addPoint([x, y], true, true);
                        }
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
            text: 'Energie active'
        },

        exporting: {
            enabled: false
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            name: 'Energie active',
            data: (function () {
                var data = [], i;
                if (dataBase[0] !== null) {
                    for (i = 0; i < dataBase.length; i += 1) {
                        data.push([
                            new Date(dataBase[i].Date).getTime(),
                            parseFloat(dataBase[i].Energie)
                        ]);
                    }
                }
                return data;
            }())
        }]
    });
}


function powerPeriod (dataBase) {
    document.getElementById('spinnerPeriodAdvanced').style.display = "none";
    document.getElementById('wattPeriodCharts').style.display = "block";
    // Create the chart
    //TODO init with yesterday and today
    $('#courbeKwhPeriod').highcharts('StockChart', {
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
            text: 'Energie active'
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
            name: 'Energie active',
            data: (function () {
                var data = [], i;
                for (i = 0; i < dataBase.length; i += 1) {
                    data.push([
                        new Date(dataBase[i].Date).getTime(),
                        parseFloat(dataBase[i].Energie)
                    ]);
                }
                return data;
            }())
        }]
    });
}

function diagramPeriod(firstSector, secondSector, thirdSector, fourthSector, mode) {
    $('#diagrammePeriod').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: mode[0].fullModeTitle
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data:
                (function () {
                var data = [];
                    if (thirdSector == null && fourthSector == null) {
                        data.push([
                            mode[0].firstSector,
                            firstSector
                        ]);
                        data.push([
                            mode[0].secondSector,
                            secondSector
                        ]);
                    } else {
                        data.push([
                            mode[0].printemps,
                            firstSector
                        ]);
                        data.push([
                            mode[0].ete,
                            secondSector
                        ]);
                        data.push([
                            mode[0].automne,
                            thirdSector
                        ]);
                        data.push([
                            mode[0].hiver,
                            fourthSector
                        ]);
                    }
                return data;
            }())
        }]
    });
}

function barPeriod(firstSector, secondSector, mode) {

    $('#barreKwh').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: mode
        },
        xAxis: {
            categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        exporting: {
            enabled: false
        },
        series:
            [firstSector, secondSector]
    });

}


function barPeriodSeason(firstSector, secondSector, thirdSector, fourthSector, mode) {

    $('#barreKwhSeason').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: mode
        },
        xAxis: {
            categories: ['Printemps', 'Eté', 'Automne', 'Hiver']
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        exporting: {
            enabled: false
        },
        series:
            [firstSector, secondSector, thirdSector, fourthSector]
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

function getSelectedMode() {
    var mode = $('#selectedMode').val();
    switch (mode) {
        case "HP/HC":
            getFullPeakTime();
            break;
        case "Jour/Nuit":
            getDayNight();
            break;
        case "Semaine/WE":
            getWeekWE();
            break;
        case "Saisons":
            getSeason();
            break;
    }
}

function getFullPeakTime() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    var mode = $('#selectedMode').val();
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
            var curr_month = dateStart.getMonth() + 1;
            var curr_year = dateStart.getFullYear();
            dateStart = curr_year + "-" + curr_month + "-" + curr_date;

            var curr_date = dateEnd.getDate() + 1;
            var curr_month = dateEnd.getMonth() + 1;
            var curr_year = dateEnd.getFullYear();
            dateEnd = curr_year + "-" + curr_month + "-" + curr_date;

            //var test = getPowerAtNight();
            var powerFullTime = JSON.parse(getHourDateQuery(dateStart,dateEnd, "SelectByDateAndHourAtNight", "21:00:00", "06:00:00"));
            var powerPeakTime = JSON.parse(getHourDateQuery(dateStart,dateEnd, "SelectByDateAndHourAtNight", "06:00:00", "21:00:00"));
            var fullMode = getFullMode(mode);
            document.getElementById('diagrammePeriod').style.display = "block";
            document.getElementById('barreKwh').style.display = "block";
            document.getElementById('barreKwhSeason').style.display = "none";
            diagramPeriod(parseInt(powerPeakTime[0].energie),parseInt(powerFullTime[0].energie), null, null ,fullMode);
        }
    }
}

function getDayNight() {
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    var mode = $('#selectedMode').val();
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

            var powerAtNight = JSON.parse(getHourDateQuery(dateStart, dateEnd, "SelectByDateAndHourAtNight", "21:00:00", "06:00:00"));
            var powerAtDay = JSON.parse(getHourDateQuery(dateStart, dateEnd, "SelectByDateAndHourAtDay", "06:00:00", "21:00:00"));
            var fullMode = getFullMode(mode);
            var powerAtNightMonday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDayOfWeekAtNight",0));
            var powerAtNightTuesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDayOfWeekAtNight",1));
            var powerAtNightWednesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDayOfWeekAtNight",2));
            var powerAtNightThursday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDayOfWeekAtNight",3));
            var powerAtNightFriday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDayOfWeekAtNight",4));
            var powerAtNightSaturday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDayOfWeekAtNight",5));
            var powerAtNightSunday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDayOfWeekAtNight",6));
            var powerAtDayMonday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,      "SelectByDayOfWeekAtDay",0));
            var powerAtDayTuesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,     "SelectByDayOfWeekAtDay",1));
            var powerAtDayWednesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,   "SelectByDayOfWeekAtDay",2));
            var powerAtDayThursday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,    "SelectByDayOfWeekAtDay",3));
            var powerAtDayFriday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,      "SelectByDayOfWeekAtDay",4));
            var powerAtDaySaturday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,    "SelectByDayOfWeekAtDay",5));
            var powerAtDaySunday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,      "SelectByDayOfWeekAtDay",6));
            var firstSector = {
                name : fullMode[0].firstSector,
                data : [parseInt(powerAtDayMonday[0].energie), parseInt(powerAtDayTuesday[0].energie), parseInt(powerAtDayWednesday[0].energie), parseInt(powerAtDayThursday[0].energie),
                    parseInt(powerAtDayFriday[0].energie), parseInt(powerAtDaySaturday[0].energie), parseInt(powerAtDaySunday[0].energie)]
            }
            var secondSector = {
                name : fullMode[0].secondSector,
                data : [parseInt(powerAtNightMonday[0].energie), parseInt(powerAtNightTuesday[0].energie), parseInt(powerAtNightWednesday[0].energie), parseInt(powerAtNightThursday[0].energie),
                    parseInt(powerAtNightFriday[0].energie), parseInt(powerAtNightSaturday[0].energie), parseInt(powerAtNightSunday[0].energie)]
            }
            document.getElementById('diagrammePeriod').style.display = "block";
            document.getElementById('barreKwh').style.display = "block";
            document.getElementById('barreKwhSeason').style.display = "none";
            diagramPeriod(parseInt(powerAtDay[0].energie),parseInt(powerAtNight[0].energie), null, null ,fullMode);
            barPeriod(firstSector, secondSector, fullMode[0].fullModeTitle);

        }
    }
}

function getHourDateQuery (dateStart, dateEnd, query, startHour, endHour) {
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api + '/' + query + '/Values?date1=' + dateStart + '&date2=' + dateEnd+'&heureDebut=' + startHour + '&heureFin=' + endHour,
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data[0] == null) {
                return 0;
            } else {
                return data;
            }
        },
        error: function() {
            document.getElementById('spinnerPeriodAdvanced').style.display = "none";
            document.getElementById("#errorMessageConnection").style.display = "block";
            $(".alert").delay(4000).slideUp(500, function() {
                document.getElementById("#errorMessageConnection").style.display = "none";
            });
        }
    }).responseText;
}

function getWeekWE() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    var mode = $('#selectedMode').val();
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

            var powerWeek = JSON.parse(getDateQuery(dateStart, dateEnd, "SelectByDateOnWeek"));
            var powerWeekEnd = JSON.parse(getDateQuery(dateStart, dateEnd, "SelectByDateOnWeekEnd"));
            var fullMode = getFullMode(mode);
            var powerAtNightMonday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDateOnWeek",0));
            var powerAtNightTuesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDateOnWeek",1));
            var powerAtNightWednesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDateOnWeek",2));
            var powerAtNightThursday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDateOnWeek",3));
            var powerAtNightFriday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDateOnWeek",4));
            var powerAtNightSaturday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDateOnWeek",5));
            var powerAtNightSunday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd, "SelectByDateOnWeek",6));
            var powerAtDayMonday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,      "SelectByDateOnWeekEnd",0));
            var powerAtDayTuesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,     "SelectByDateOnWeekEnd",1));
            var powerAtDayWednesday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,   "SelectByDateOnWeekEnd",2));
            var powerAtDayThursday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,    "SelectByDateOnWeekEnd",3));
            var powerAtDayFriday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,      "SelectByDateOnWeekEnd",4));
            var powerAtDaySaturday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,    "SelectByDateOnWeekEnd",5));
            var powerAtDaySunday = JSON.parse(getDayOfWeekQuery(dateStart,dateEnd,      "SelectByDateOnWeekEnd",6));
            var firstSector = {
                name : fullMode[0].firstSector,
                data : [parseInt(powerAtNightMonday[0].energie), parseInt(powerAtNightTuesday[0].energie), parseInt(powerAtNightWednesday[0].energie), parseInt(powerAtNightThursday[0].energie),
                    parseInt(powerAtNightFriday[0].energie), parseInt(powerAtNightSaturday[0].energie), parseInt(powerAtNightSunday[0].energie)]
            }
            var secondSector = {
                name : fullMode[0].secondSector,
                data : [parseInt(powerAtDayMonday[0].energie), parseInt(powerAtDayTuesday[0].energie), parseInt(powerAtDayWednesday[0].energie), parseInt(powerAtDayThursday[0].energie),
                    parseInt(powerAtDayFriday[0].energie), parseInt(powerAtDaySaturday[0].energie), parseInt(powerAtDaySunday[0].energie)]
            }
            document.getElementById('diagrammePeriod').style.display = "block";
            document.getElementById('barreKwh').style.display = "none";
            document.getElementById('barreKwhSeason').style.display = "none";
            diagramPeriod(parseInt(powerWeek[0].energie),parseInt(powerWeekEnd[0].energie), null, null ,fullMode);
            //barPeriod(firstSector, secondSector, null, null, mode);

        }
    }
}

function getSeason() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    var mode = $('#selectedMode').val();
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
            var powerSpring = JSON.parse(getDateQuery(dateStart, dateEnd, "SelectByDateOnSpring"));
            var powerSummer = JSON.parse(getDateQuery(dateStart, dateEnd, "SelectByDateOnSummer"));
            var powerAutumn = JSON.parse(getDateQuery(dateStart, dateEnd, "SelectByDateOnAutumn"));
            var powerWinter = JSON.parse(getDateQuery(dateStart, dateEnd, "SelectByDateOnWinter"));
            var fullMode = getFullMode(mode);
            var firstSector = {
                name : fullMode[0].printemps,
                data : [parseInt(powerSpring[0].energie)]
            }
            var secondSector = {
                name : fullMode[0].ete,
                data : [parseInt(powerSummer[0].energie)]
            }
            var thirdSector = {
                name : fullMode[0].automne,
                data : [parseInt(powerAutumn[0].energie)]
            }
            var fourthSector = {
                name : fullMode[0].hiver,
                data : [parseInt(powerWinter[0].energie)]
            }
            document.getElementById('diagrammePeriod').style.display = "none";
            document.getElementById('barreKwh').style.display = "none";
            document.getElementById('barreKwhSeason').style.display = "block";
            //diagramPeriod(parseInt(powerSpring[0].energie),parseInt(powerSummer[0].energie), parseInt(powerAutumn[0].energie),parseInt(powerWinter[0].energie) ,fullMode);
            barPeriodSeason(firstSector, secondSector, thirdSector, fourthSector, fullMode[0].fullModeTitle);

        }
    }
}

function getDateQuery(dateStart, dateEnd, query){
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api + '/' + query + '/Values?date1=' + dateStart + '&date2=' + dateEnd,
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data[0] == null) {
                return 0;
            } else {
                return data;
            }
        },
        error: function() {
            document.getElementById('spinnerPeriodAdvanced').style.display = "none";
            document.getElementById("#errorMessageConnection").style.display = "block";
            $(".alert").delay(4000).slideUp(500, function() {
                document.getElementById("#errorMessageConnection").style.display = "none";
            });
        }
    }).responseText;}

function getDayOfWeekQuery(dateStart, dateEnd, query, dayOfWeek){
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api + '/' + query + '/Values?date1=' + dateStart + '&date2=' + dateEnd + '&dayOfWeek=' + dayOfWeek,
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data[0] == null) {
                return 0;
            } else {
                return data;
            }
        },
        error: function() {
            document.getElementById('spinnerPeriodAdvanced').style.display = "none";
            document.getElementById("#errorMessageConnection").style.display = "block";
            $(".alert").delay(4000).slideUp(500, function() {
                document.getElementById("#errorMessageConnection").style.display = "none";
            });
        }
    }).responseText;}

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

function getFullMode (selectedMode) {
    var data = [];
    switch (selectedMode) {
        case "HP/HC":
            data.push({
                fullModeTitle: "Répartition heures pleines / heures creuses",
                firstSector: "Heures pleines",
                secondSector: "Heures creuses"
            });
            break;
        case "Jour/Nuit":
            data.push({
                fullModeTitle: "Répartition jours / nuits",
                firstSector: "Jours",
                secondSector: "Nuits"
            });
            break;
        case "Semaine/WE":
            data.push({
                fullModeTitle: "Répartition semaines / week-end",
                firstSector: "Semaines",
                secondSector: "Week-end"
            });
            break;
        case "Saisons":
            data.push({
                fullModeTitle: "Répartition saisons",
                printemps: "Printemps",
                ete: "Eté",
                automne: "Automne",
                hiver: "Hiver"
            });
            break;
    }
    return data;
}