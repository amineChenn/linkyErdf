
var url;
var port;
var projectDirectory;
var api;

$.getJSON("conf.json", function (data) {
    url = data["url"];
    port = data["port"];
    projectDirectory = data["projectDirectory"];
    api = data["api"];
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() -1 );
    $('.dateEndAvanceePeriod').datepicker("setDate", new Date());
    $('.dateStartAvanceePeriod').datepicker("setDate", yesterday);

    $('#dateStartAvancee').on('changeDate', function () {
        $('.datepicker').hide();

    });

    $('#dateEndAvancee').on('changeDate', function () {
        $('.datepicker').hide();

    });
});

function getAjax (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectSumPapparente?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getPuissanceApparente() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";


                var sumPapparente = getAjax(constDateFin,constDateDebut);
                sumPapparente = JSON.parse(sumPapparente);
                if(sumPapparente[0].SumPapparente == null){
                    sumPapparente[0].SumPapparente = '0';
                }
                sum.push(parseInt(sumPapparente[0].SumPapparente));
            }
        }
    }
    return sum;
}
function newPuissanceChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate();
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'apparenteEnergiphile' },

        title: {
            text: "Puissance apparente entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'VA'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            },
                {
                    value: 150,
                    color: '#434348',
                    width: 2,
                    zIndex: 4,
                    label: {
                        text: 'Puissance souscrite',
                        align: 'right',
                        style: {
                            color: 'gray'
                        }
                    }
                }]
        },
        tooltip: {
            valueSuffix: ' VA'
        },
        plotOptions: {
            series: {
                color:'#f7a35c'
            }
        },
        series : [{
            name : 'Puissance apparente ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getPuissanceApparente(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                }
                return data;
            }())
        }]

    });

    //on prend la charte, on la transforme en svg
    var svg = chart.getSVG();

    //et on la balance sur le serveur
    $.ajax({
        type: 'POST',
        url: 'pdf/energiphileSvgPapparente.php',
        data: {papparente  : svg} //le code "texte" du svg


    });
}


function actualiserGraphique() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(7000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
    }
    else{

    elems = document.getElementById("divi");


    if (dateStart != null && dateEnd != null) {
        var curr_date = dateStart.getDate();
        var curr_month = dateStart.getMonth() + 1; //Months are zero based
        var curr_year = dateStart.getFullYear();
        dateStart =  curr_date+ "/" + curr_month + "/" + curr_year;

        var curr_date = dateEnd.getDate();
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        dateEnd = curr_date + "/" + curr_month + "/" + curr_year;

        $('.dateDebut').html(dateStart);
        $('.dateFin').html(dateEnd);
    }


    elems.style.display = 'block';
        getAllCharts();
}
}


function getAjaxReactive (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectSumPreactive?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getPuissanceReactive() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";


                var sumPreactive = getAjaxReactive(constDateFin,constDateDebut);
                sumPreactive = JSON.parse(sumPreactive);
                if(sumPreactive[0].SumPreactive == null){
                    sumPreactive[0].SumPreactive = '0';
                }
                sum.push(parseFloat(sumPreactive[0].SumPreactive));
            }
        }
    }
    return sum;
}
function newPreactiveChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate();
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'reactiveEnergiphile',
            type: 'area'},

        title: {
            text: "Puissance reactive entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'VA'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' VA'
        },
        plotOptions: {
            series: {
                color:'#8085e9'
            }
        },
        series : [{
            name : 'Puissance reactive ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getPuissanceReactive(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                }
                return data;
            }())
        }]

    });

    //on prend la charte, on la transforme en svg
    var svg = chart.getSVG();

    //et on la balance sur le serveur
    $.ajax({
        type: 'POST',
        url: 'pdf/energiphileSvgPreactive.php',
        data: {preactive  : svg} //le code "texte" du svg


    });
}

function getAjaxIntensite (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectSumIntensite?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getIntensite() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";


                var sumIntensite = getAjaxIntensite(constDateFin,constDateDebut);
                sumIntensite = JSON.parse(sumIntensite);
                if(sumIntensite[0].SumIntensite == null){
                    sumIntensite[0].SumIntensite = '0';
                }
                sum.push(parseInt(sumIntensite[0].SumIntensite));
            }
        }
    }
    return sum;
}
function newIntensiteChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate();
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'intensiteEnergiphile',
            type: 'area'
        },

        title: {
            text: "Intensite soutiree entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Ampere'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' Ampere'
        },
        plotOptions: {
            series: {
                color:'#f15c80'
            }
        },
        series : [{
            name : 'Intensite ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getIntensite(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                }
                return data;
            }())
        }]

    });

    //on prend la charte, on la transforme en svg
    var svg = chart.getSVG();

    //et on la balance sur le serveur
    $.ajax({
        type: 'POST',
        url: 'pdf/energiphileSvgIntensite.php',
        data: {intensite  : svg} //le code "texte" du svg


    });
}

function getAjaxTension (dateFin,dateDebut) {
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api +"/SelectSumTension?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getTension() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
        $(".alert").delay(4000).slideUp(500, function() {
            document.getElementById("#errorMessageDate").style.display = "none";
        });
        $('#dateEndAvancee').datepicker({
            startDate: $('#dateStartAvancee').datepicker("getDate")
        });
    }
    else {
        if (dateStart != null && dateEnd != null) {

            var daysOfYear = [];
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";


                var sumTension = getAjaxTension(constDateFin,constDateDebut);
                sumTension = JSON.parse(sumTension);
                if(sumTension[0].SumTension == null){
                    sumTension[0].SumTension = '0';
                }
                sum.push(parseInt(sumTension[0].SumTension));
            }
        }
    }
    return sum;
}
function newTensionChart() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate();
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chart = new Highcharts.Chart({
        chart: { renderTo: 'tensionEnergiphile' },

        title: {
            text: "Tension soutiree entre "+dateS+ " et "+ dateE ,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function(){
                var b = [], te =[], fin=[];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },

        yAxis: {
            title: {
                text: 'Volt'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            },
                {
                    value: 260,
                    color: '#ff0000',
                    width: 2,
                    zIndex: 4,
                    label: {
                        text: 'Max',
                        align: 'right',
                        style: {
                            color: 'gray'
                        }
                    }
                },
                {
                value: 216,
                color: '#ff0000',
                width: 2,
                zIndex: 4,
                    label: {
                        text: 'Min',
                        align: 'right',
                        style: {
                            color: 'gray'
                        }
                    }
            }
        ]

        },
        tooltip: {
            valueSuffix: ' Volt'
        },
        series : [{
            name : 'Tension ',
            data : (function () {
                // generate an array of random data
                var data = [],  i, sum = getTension(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    data.push([
                        constDateFin,
                        sum[i]
                    ]);
                }
                return data;
            }())
        }]

    });

    //on prend la charte, on la transforme en svg
    var svg = chart.getSVG();

    //et on la balance sur le serveur
    $.ajax({
        type: 'POST',
        url: 'pdf/energiphileSvgTension.php',
        data: {tension  : svg} //le code "texte" du svg


    });
}

function getEnergieConsomme(dateFin, dateDebut) {
    return $.ajax({
        type: "GET",
        url: url + ":" + port + "/" + projectDirectory + "/" + api +"/EnergieConsommee?date1="+dateFin+"&date2="+dateDebut,
        dataType: 'json',
        async: false,
        success: function(data) {
        }
    }).responseText;
}

function getEnergieTotalConsommee() {

    var sum=[];
    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");
    if (dateEnd<dateStart) {
        document.getElementById("#errorMessageDate").style.display = 'block';
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

            var daysOfYear = [];
            for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                daysOfYear.push(new Date(d));
            }
            //var test = daysOfYear[0];
            for(var t=0 ; t < daysOfYear.length; t++){
                var selectedDate = daysOfYear[t];
                var day = selectedDate.getDate();
                var month = selectedDate.getMonth() + 1; //Months are zero based
                var year = selectedDate.getFullYear();
                var constDateFin = year + "-" + month + "-" + day+ " 00:00:00";
                var constDateDebut = year + "-" + month + "-" + day + " 23:59:59";


                var energieConsommee = getEnergieConsomme(constDateFin,constDateDebut);
                energieConsommee = JSON.parse(energieConsommee);
                if(energieConsommee[0].EnergieConsommee == null){
                    energieConsommee[0].EnergieConsommee = '0';
                }
                sum.push(parseFloat(energieConsommee[0].EnergieConsommee));
            }


        }
    }
    return sum;
}

function newChartEnergie() {

    var dateStart = $('#dateStartAvancee').datepicker("getDate");
    var dateEnd = $('#dateEndAvancee').datepicker("getDate");

    if (dateStart != null && dateEnd != null) {
        var curr_d = dateStart.getDate();
        var curr_m = dateStart.getMonth() + 1; //Months are zero based
        var curr_y = dateStart.getFullYear();
        var dateS = curr_d + "/" + curr_m + "/" + curr_y;

        var curr_date = dateEnd.getDate();
        var curr_month = dateEnd.getMonth() + 1; //Months are zero based
        var curr_year = dateEnd.getFullYear();
        var dateE = curr_date + "/" + curr_month + "/" + curr_year;
    }
    chartEnergy = new Highcharts.Chart({
        chart: {renderTo: 'energiphileEnergie',
            type : 'column'},

        title: {
            text: "Energie consommee entre " + dateS + " et " + dateE,
            x: -20 //center
        },

        xAxis: {
            title: {
                text: 'Dates'
            },
            categories: (function () {
                var b = [], te = [], fin = [];

                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    b.push(new Date(d));
                }

                for (i = 0; i < b.length; i += 1) {
                    var selectedDate = b[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    te = year + "/" + month + "/" + day;
                    fin.push(te);
                }
                return fin;
            })

        },
        exporting: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'KWH'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808050'
            }]
        },
        tooltip: {
            valueSuffix: ' KWH'
        },
        plotOptions: {
            series: {
                color: '#90ed7d'
            }
        },
        series: [{
            name: 'Energie active ',
            data: (function () {
                // generate an array of random data
                var data = [], i, sum = getEnergieTotalConsommee(), dateOfYear = [];
                for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {

                    dateOfYear.push(new Date(d));
                }
                for (i = 0; i < dateOfYear.length; i += 1) {
                    var selectedDate = dateOfYear[i];
                    var day = selectedDate.getDate();
                    var month = selectedDate.getMonth() + 1; //Months are zero based
                    var year = selectedDate.getFullYear();
                    var constDateFin = year + "/" + month + "/" + day;
                    data.push([
                        constDateFin,
                        (Math.round(sum[i]*1000)/1000)
                    ]);
                }
                return data;
            }())
        }]

    });

    //on prend la charte, on la transforme en svg
    var svg = chartEnergy.getSVG();

    //et on la balance sur le serveur
    $.ajax({
        type: 'POST',
        url: 'pdf/energiphileSvgEnergie.php',
        data: {energie: svg} //le code "texte" du svg


    });
}

function getAllCharts()
{
    newPuissanceChart();
    newPreactiveChart();
    newIntensiteChart();
    newTensionChart();
    newChartEnergie();
}