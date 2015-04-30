var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select("div.canvas").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yearValue = [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012];
var scaleValue = ["0E","20E","40E","60E","80E","100E","120E","140E","160E","180E","200E","220E","240E","260E","280E","300E","320E","340E","360E"];
var infoValue = ["by coal","by hydro","by natural gas","by nuclear","by petroleum"];
var selectedYear = 1990;
var beginPint = (selectedYear-1990)*10;
var scaleData = d3.scale.linear().range([0,200]);

/*------Draw World Map-------*/
var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

d3.json("/data/world-50m.json", function(error, world) {
    console.log(world);
    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path)
        .style('fill','rgb(70,180,225)');

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

/*------Load Data-------*/
/* begin to load data */
console.log("Start loading data");
queue()
    .defer(d3.csv,"data/eg.elc.coal.kh_Indicator_zh_csv_v2.csv",production)
    .defer(d3.csv,"data/eg.elc.hyro.kh_Indicator_zh_csv_v2.csv",production)
    .defer(d3.csv,"data/eg.elc.ngas.kh_Indicator_zh_csv_v2.csv",production)
    .defer(d3.csv,"data/eg.elc.nucl.kh_Indicator_zh_csv_v2.csv",production)
    .defer(d3.csv,"data/eg.elc.petr.kh_Indicator_zh_csv_v2.csv",production)
    .await(dataLoaded);

/*load rows*/
function production(d) {
    var newRow = {};
    newRow.countryID = d.CountryCode;
    newRow.countryName = d.CountryName;
    newRow.dataSeries = [];
    for(var year=1990; year<=2012; year++){
        newRow.dataSeries.push({
            year:year,
            value:+d[year]
        })
    }
    return newRow;
}
function dataLoaded(err, coalPro, hyroPro, ngasPro, nuclPro, petrPro) {
    /*check whether countryID in different csv is all the same*/
    for (var i=0;i<coalPro.length;i++) {
        if (coalPro[i].countryID == hyroPro[i].countryID ) {
            if (coalPro[i].countryID == ngasPro[i].countryID ) {
                if (coalPro[i].countryID == nuclPro[i].countryID ) {
                    if (coalPro[i].countryID == petrPro[i].countryID ) {
                        console.log("Current");
                    }
                }
            }
        } else {
            console.log("Row "+i+" is Error!!!");
        }
    }

    console.log("Data loaded");

    /*sum the total production of each countries and sort*/
    var dataSum = [];
    var topTenCID = [];
    var topTenCoal = [];
    var topTenHyro = [];
    var topTenNgas = [];
    var topTenNucl = [];
    var topTenPetr = [];
    var topTenYear = [];

    var yearLoop = 1990;
    while (yearLoop<=2012) {

        for (var i=0;i<coalPro.length;i++) {
            dataSum[i] = [{valueSum:null,
                countryIDDisplay:null,country:null,
                valueCoal:null, valueHyro:null, valueNgas:null, valueNucl:null, valuePetr:null}];
        }

        for (var i=0;i<coalPro.length;i++) {
            for (var j=0;j<coalPro[i].dataSeries.length;j++) {
                if (coalPro[i].dataSeries[j].year == yearLoop) {//crops[countryID].dataSeries[value + year]
                    dataSum[i].valueSum = coalPro[i].dataSeries[j].value+ hyroPro[i].dataSeries[j].value+ ngasPro[i].dataSeries[j].value+ nuclPro[i].dataSeries[j].value+ petrPro[i].dataSeries[j].value;
                    dataSum[i].countryIDDisplay = coalPro[i].countryID;
                    dataSum[i].country = coalPro[i].countryName;
                    dataSum[i].valueCoal = coalPro[i].dataSeries[j].value;
                    dataSum[i].valueHyro = hyroPro[i].dataSeries[j].value;
                    dataSum[i].valueNgas = ngasPro[i].dataSeries[j].value;
                    dataSum[i].valueNucl = nuclPro[i].dataSeries[j].value;
                    dataSum[i].valuePetr = petrPro[i].dataSeries[j].value;
                }
            }
        }
        console.log(dataSum.countryIDDisplay);

        dataSum.sort(function(a,b) {
            if (a.valueSum>= b.valueSum) {
                return -1;
            } else {
                return 1;
            }
        });

        dataSum.sort(function(a,b) {
            if (a.valueSum>= b.valueSum) {
                return -1;
            } else {
                return 1;
            }
        });

        var i = 0, j = 0;
        while (i<10) {
            if ((dataSum[j].countryIDDisplay != 'WLD') &&
                (dataSum[j].countryIDDisplay != 'UMC') &&
                (dataSum[j].countryIDDisplay != 'SSF') &&
                (dataSum[j].countryIDDisplay != 'SSA') &&
                (dataSum[j].countryIDDisplay != 'OED') &&
                (dataSum[j].countryIDDisplay != 'OEC') &&
                (dataSum[j].countryIDDisplay != 'NOC') &&
                (dataSum[j].countryIDDisplay != 'NAC') &&
                (dataSum[j].countryIDDisplay != 'MNA') &&
                (dataSum[j].countryIDDisplay != 'MIC') &&
                (dataSum[j].countryIDDisplay != 'MEA') &&
                (dataSum[j].countryIDDisplay != 'LMY') &&
                (dataSum[j].countryIDDisplay != 'LMC') &&
                (dataSum[j].countryIDDisplay != 'LIC') &&
                (dataSum[j].countryIDDisplay != 'LDC') &&
                (dataSum[j].countryIDDisplay != 'LCN') &&
                (dataSum[j].countryIDDisplay != 'LAC') &&
                (dataSum[j].countryIDDisplay != 'INX') &&
                (dataSum[j].countryIDDisplay != 'HPC') &&
                (dataSum[j].countryIDDisplay != 'HIC') &&
                (dataSum[j].countryIDDisplay != 'FCS') &&
                (dataSum[j].countryIDDisplay != 'EUU') &&
                (dataSum[j].countryIDDisplay != 'EMU') &&
                (dataSum[j].countryIDDisplay != 'ECS') &&
                (dataSum[j].countryIDDisplay != 'ECA') &&
                (dataSum[j].countryIDDisplay != 'EAS') &&
                (dataSum[j].countryIDDisplay != 'EAP') &&
                (dataSum[j].countryIDDisplay != 'CEB') &&
                (dataSum[j].countryIDDisplay != 'CSS') &&
                (dataSum[j].countryIDDisplay != 'CHI') &&
                (dataSum[j].countryIDDisplay != 'ARB') &&
                (dataSum[j].countryIDDisplay != 'SAS')) {
                topTenCID.push(dataSum[j].country);
                topTenCoal.push(dataSum[j].valueCoal);
                topTenHyro.push(dataSum[j].valueHyro);
                topTenNgas.push(dataSum[j].valueNgas);
                topTenNucl.push(dataSum[j].valueNucl);
                topTenPetr.push(dataSum[j].valuePetr);
                topTenYear.push(yearLoop);
                i++;
            }
            j++;
        }

        yearLoop++;
    }
    console.log(topTenCID);
    draw(topTenCID,topTenCoal,topTenHyro,topTenNgas,topTenNucl,topTenPetr,topTenYear);
}

/*------draw-------*/
function draw(dID,dCoalP,dHyroP,dNgasP,dNuclP,dPterP,dYearP) {

    /*------Draw Year Button-------*/
    var scaleValueText = svg.append("g")
        .selectAll('text')
        .data(scaleValue)
        .enter()
        .append('text')
        .attr("class","text")
        .text(function(d,i) {
            return d;
        })
        .attr("x",38)
        .attr("y",function(d,i) {
            return 86+i*40;
        })
        .style("fill","white")
        .style("text-anchor","end");

    var scaleValueLine = svg.append("g")
        .selectAll('rect')
        .data(scaleValue)
        .enter()
        .append('rect')
        .attr("class","rect")
        .style('fill','white')
        .attr("x",40)
        .attr("y",function(d,i) {
            return 80+i*40;
        })
        .attr("width",10)
        .attr("height",2);

    var infoValueText = svg.append("g")
        .selectAll('text')
        .data(infoValue)
        .enter()
        .append('text')
        .attr("class","text")
        .text(function(d,i) {
            return d;
        })
        .attr("x",1000)
        .attr("y",function(d,i) {
            return 450+i*20;
        })
        .style("fill","white")
        .style("text-anchor","start");

    var infoRect1 = svg.append("g")
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(255,245,44)')
        .attr("x",950)
        .attr("y",437)
        .attr("width",45)
        .attr("height",15);
    var infoRect2 = svg.append("g")
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(91,111,215)')
        .attr("x",950)
        .attr("y",457)
        .attr("width",45)
        .attr("height",15);
    var infoRect3 = svg.append("g")
        .append('rect')
        .attr("class","rect")
        .style('fill','white')
        .attr("x",950)
        .attr("y",477)
        .attr("width",45)
        .attr("height",15);
    var infoRect4 = svg.append("g")
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(226,77,77)')
        .attr("x",950)
        .attr("y",497)
        .attr("width",45)
        .attr("height",15);
    var infoRect5 = svg.append("g")
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(80,200,77)')
        .attr("x",950)
        .attr("y",517)
        .attr("width",45)
        .attr("height",15);

    var yearText = svg.append("g")
        .selectAll("text")
        .data(yearValue)
        .enter()
        .append('text')
        .attr("class","text")
        .text(function(d) {
            return d.toString();
        })
        .attr("x",0)
        .attr("y",20)
        .style("fill","white")
        .style("opacity",0);

    var rectYear = svg.append("g")
        .selectAll('rect')
        .data(yearValue)
        .enter()
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(230,200,150)')
        .attr("x",0)
        .attr("y",0)
        .attr("width",45)
        .attr("height",30)
        .style("opacity",0)
        .on("click",function() {
            d3.select(this)
                .style("fill",function(d) {
                    selectedYear = d;
                    return 'rgb(230,200,150)';
                })
            rectYear
                .transition()
                .duration(1500)
                .attr("x", 0)
                .style("opacity",0);
            yearText
                .transition()
                .duration(1500)
                .attr("x", 0)
                .style("opacity",0);
            selectYearText
                .text(function() {
                    beginPint = (selectedYear-1990)*10;
                    return selectedYear.toString()
                });
            idText
                .text(function(d,i) {
                if (dYearP[i] == selectedYear) {
                    return d;}
                })
                .attr("x", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return 99+(i-beginPint)*100;
                    }
                })
            rectCoal
                .attr("x", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return 62+(i-beginPint)*100;
                    }
                })
                .attr("height", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return d/5000000000;
                    }
                });
            rectHyro
                .attr("x", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return 77+(i-beginPint)*100;
                    }
                })
                .attr("height", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return d/5000000000;
                    }
                });
            rectNgas
                .attr("x", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return 92+(i-beginPint)*100;
                    }
                })
                .attr("height", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return d/5000000000;
                    }
                });
            rectNucl
                .attr("x", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return 107+(i-beginPint)*100;
                    }
                })
                .attr("height", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return d/5000000000;
                    }
                });
            rectPetr
                .attr("x", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return 122+(i-beginPint)*100;
                    }
                })
                .attr("height", function (d,i) {
                    if (dYearP[i] == selectedYear) {
                        return d/5000000000;
                    }
                });
        });

    var selectYearText = svg.append("g")
        .append('text')
        .text(selectedYear.toString())
        .attr("x",3)
        .attr("y",20)
        .style("fill","white");

    var SelectYear = svg.append("g")
        .attr("class","rect")
        .append('rect')
        .style('fill','rgb(70,180,225)')
        .attr("x",0)
        .attr("y",0)
        .attr("width",45)
        .attr("height",30)
        .style("opacity",0.5)
        .on("click", function() {
            rectYear
                .transition()
                .duration(1500)
                .attr("x", function(d,i) {
                    return 45+i*45;
                })
                .style("opacity",0.5);
            yearText
                .transition()
                .duration(1500)
                .attr("x", function(d,i) {
                    return 48+i*45;
                })
                .style("opacity",1);
        });

    /*------display-------*/
    var idText = svg.append("g")
        .selectAll("text")
        .data(dID)
        .enter()
        .append('text')
        .text(function(d,i) {
            if (dYearP[i] == selectedYear) {
                return d;
            }
        })
        .attr("x", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return 99+(i-beginPint)*100;
            }
        })
        .attr("y",70)
        .style("fill","white")
        .style("text-anchor","middle");

    var rectCoal = svg.append("g")
        .selectAll('rect')
        .data(dCoalP)
        .enter()
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(255,245,44)')
        .attr("x", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return 62+(i-beginPint)*100;
            }
        })
        .attr("y",80)
        .attr("width",14)
        .attr("height", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return d/5000000000;
            }
        });

    var rectHyro = svg.append("g")
        .selectAll('rect')
        .data(dHyroP)
        .enter()
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(91,111,215)')
        .attr("x", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return 77+(i-beginPint)*100;
            }
        })
        .attr("y",80)
        .attr("width",14)
        .attr("height", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return d/5000000000;
            };
        });

    var rectNgas = svg.append("g")
        .selectAll('rect')
        .data(dNgasP)
        .enter()
        .append('rect')
        .attr("class","rect")
        .style('fill','white')
        .attr("x", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return 92+(i-beginPint)*100;
            }
        })
        .attr("y",80)
        .attr("width",14)
        .attr("height", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return d/5000000000;
            };
        });

    var rectNucl = svg.append("g")
        .selectAll('rect')
        .data(dNuclP)
        .enter()
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(226,77,77)')
        .attr("x", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return 107+(i-beginPint)*100;
            }
        })
        .attr("y",80)
        .attr("width",14)
        .attr("height", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return d/5000000000;
            };
        });

    var rectPetr = svg.append("g")
        .selectAll('rect')
        .data(dPterP)
        .enter()
        .append('rect')
        .attr("class","rect")
        .style('fill','rgb(80,200,77)')
        .attr("x", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return 122+(i-beginPint)*100;
            }
        })
        .attr("y",80)
        .attr("width",14)
        .attr("height", function (d,i) {
            if (dYearP[i] == selectedYear) {
                return d/5000000000;
            };
        });
}

