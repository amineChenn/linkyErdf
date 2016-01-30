$(function () {

    Highcharts.setOptions({
        global : {
            useUTC : false
        }
    });

    // Create the chart
    $('#courbeKwh').highcharts('StockChart', {
        chart : {
            type : 'spline',
            events : {
                load : function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    var series2 = this.series[1];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.round(Math.random() * 100);
                            z = Math.round(Math.random() * 100);
                        series.addPoint([x, y], true, true);
                        series2.addPoint([x, z], true, true);
                    }, 1000);
                }
            }
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

        title : {
            text : 'Consommation kWh'
        },

        exporting: {
            enabled: false
        },

        series : [{
            name : 'Random data',
            data : (function () {
                // generate an array of random data
                var data = [], time = (new Date()).getTime(), i;

                for (i = -999; i <= 0; i += 1) {
                    data.push([
                        time + i * 1000,
                        Math.round(Math.random() * 100)
                    ]);
                }
                return data;
            }())
        },{
              name : 'Random data',
              data : (function () {
                  // generate an array of random data
                  var data = [], time = (new Date()).getTime(), i;

                  for (i = -999; i <= 0; i += 1) {
                      data.push([
                          time + i * 1000,
                          Math.round(Math.random() * 100)
                      ]);
                  }
                  return data;
              }())
          }]
    });

    $('#diagramme').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Répartition heures pleines / heures creuses'
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
            data: [{
                name: 'Secteur 6',
                y: 56.33
            }, {
                name: 'Secteur 1',
                y: 24.03,
                sliced: true,
                selected: true
            }, {
                name: 'Secteur 2',
                y: 10.38
            }, {
                name: 'Secteur 3',
                y: 4.77
            }, {
                name: 'Secteur 4',
                y: 0.91
            }, {
                name: 'Secteur 5',
                y: 0.2
            }]
        }]
    });

    $('#courbeKwhPeriod').highcharts('StockChart', {
            chart : {
                type : 'spline',
                events : {
                    load : function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        var series2 = this.series[1];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.round(Math.random() * 100);
                                z = Math.round(Math.random() * 100);
                            series.addPoint([x, y], true, true);
                            series2.addPoint([x, z], true, true);
                        }, 1000);
                    }
                }
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

            title : {
                text : 'Consommation kWh'
            },

            exporting: {
                enabled: false
            },

            series : [{
                name : 'Random data',
                data : (function () {
                    // generate an array of random data
                    var data = [], time = (new Date()).getTime(), i;

                    for (i = -999; i <= 0; i += 1) {
                        data.push([
                            time + i * 1000,
                            Math.round(Math.random() * 100)
                        ]);
                    }
                    return data;
                }())
            },{
                  name : 'Random data',
                  data : (function () {
                      // generate an array of random data
                      var data = [], time = (new Date()).getTime(), i;

                      for (i = -999; i <= 0; i += 1) {
                          data.push([
                              time + i * 1000,
                              Math.round(Math.random() * 100)
                          ]);
                      }
                      return data;
                  }())
              }]
        });

        $('#diagrammePeriod').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Répartition heures pleines / heures creuses'
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
                data: [{
                    name: 'Secteur 6',
                    y: 56.33
                }, {
                    name: 'Secteur 1',
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Secteur 2',
                    y: 10.38
                }, {
                    name: 'Secteur 3',
                    y: 4.77
                }, {
                    name: 'Secteur 4',
                    y: 0.91
                }, {
                    name: 'Secteur 5',
                    y: 0.2
                }]
            }]
        });

        $('#barreKwh').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
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
                series: [{
                    name: 'Heures pleines',
                    data: [5, 3, 4, 7, 6, 8, 9]
                }, {
                    name: 'Heures Creuses',
                    data: [2, 2, 3, 2, 2, 5, 4]
                }]
            });

});
