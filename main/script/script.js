var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

/*setting base*/
var year0 = 1990, year1 = 2012;

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
    for(var year=year0; year <= year1; year++){
        newRow.dataSeries.push({
            year:year,
            value:+d[year]
        })
    }
    return newRow;
}

function dataLoaded(err, coalPro, hyroPro, ngasPro, nuclPro, petrPro) {
    var allPro = [
        {crop: "coalPro", array: coalPro},
        {crop: "hyroPro", array: hyroPro},
        {crop: "ngasPro", array: ngasPro},
        {crop: "nuclPro", array: nuclPro},
        {crop: "petrPro", array: petrPro}
    ];

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

    /*setting year*/
    yearSelected = 1990;

    /*sum the total production of each countries and sort*/
    var dataSum = [];
    for (var i=0;i<coalPro.length;i++) {
        dataSum[i] = [{valueSum:null,
            countryIDDisplay:null,
            valueCoal:null, valueHyro:null, valueNgas:null, valueNucl:null, valuePetr:null}];
    }

    for (var i=0;i<coalPro.length;i++) {
        for (var j=0;j<coalPro[i].dataSeries.length;j++) {
            if (coalPro[i].dataSeries[j].year == yearSelected) {//crops[countryID].dataSeries[value + year]
                dataSum[i].valueSum = coalPro[i].dataSeries[j].value+ hyroPro[i].dataSeries[j].value+ ngasPro[i].dataSeries[j].value+ nuclPro[i].dataSeries[j].value+ petrPro[i].dataSeries[j].value;
                dataSum[i].countryIDDisplay = coalPro[i].countryID;
                dataSum[i].valueCoal = coalPro[i].dataSeries[j].value;
                dataSum[i].valueHyro = hyroPro[i].dataSeries[j].value;
                dataSum[i].valueNgas = ngasPro[i].dataSeries[j].value;
                dataSum[i].valueNucl = nuclPro[i].dataSeries[j].value;
                dataSum[i].valuePter = petrPro[i].dataSeries[j].value;
            }
        }
    }

    dataSum.sort(function(a,b) {
        if (a.valueSum>= b.valueSum) {
            return -1;
        } else {
            return 1;
        }
    });

    /*Get Top 10*/
    var topTen = [];
    for (var i=0;i<10;i++) {
        topTen[i] = [{valueSum:null,
            countryIDDisplay:null,
            valueCoal:null, valueHyro:null, valueNgas:null, valueNucl:null, valuePetr:null}];
    }
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
            (dataSum[j].countryIDDisplay != 'EUU') &&
            (dataSum[j].countryIDDisplay != 'EMU') &&
            (dataSum[j].countryIDDisplay != 'ECS') &&
            (dataSum[j].countryIDDisplay != 'ECA') &&
            (dataSum[j].countryIDDisplay != 'EAS') &&
            (dataSum[j].countryIDDisplay != 'EAP') &&
            (dataSum[j].countryIDDisplay != 'ARB')) {
            topTen[i] = dataSum[j];
            i++;
        }
        j++;
    }

    console.log(topTen);

    draw(topTen);
}

function draw(topTen) {

}
