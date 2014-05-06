console.time("run");
/**********************/
var startDate = new Date("01/01/2005"); 
var endDate = new Date("12/01/2015"); 
/**********************/

var klineio =  require("../klineio").config(startDate, endDate);
var cluster = require('cluster');

var detailedDateResult = {};
var detailedDateResultStart = new Date("01/01/2011");
var detailedDateResultEnd = new Date("01/01/2012");
var detailedDateResultTotalMin = 20;
//var dateSections = [new Date("01/01/2008"), new Date("01/01/2009")]; 
var dateSections = [new Date("01/01/2008"), new Date("01/01/2009"), new Date("01/01/2010"), new Date("01/01/2011"), new Date("01/01/2012"), new Date("01/01/2013")]; 

var klineForm = "bullNeedle";
var intersectionKLineForm = "";
var unionKLineForm = "";
//0.8313 'reversedHammerA,wBottom' ' of ' [ 'hammerA', 'reversedHammerA', 'wBottom
//"wBottom, wBottomA, headShoulderBottom, on8While21UpVolumeHigh, on8While21Up, 
//red3, redGreenRed, greenInRed, redNGreenRed";
//morningStar, sidewaysCompression

var stocksShowLog = [];//["SZ002158", "SH600061"];//["SH600987"];//["SZ002127"];
var showLogDates =[]//["11/14/2011"];

var stocks = klineio.getAllStockIds();
//stocks = ['SZ002554']//['SZ002371', "SZ002158", "SH600061"];

if (cluster.isMaster) {
    var stocksLen = stocks.length;
    // var masterTotal = 0;
    // var masterWins = 0;
    var masterResult = {master_total:0, master_win:0};
    var masterDetailedDateResult = {};
    var funName;


    var numCPUs = require('os').cpus().length;
    var forkStocks = Math.ceil(stocksLen/numCPUs);
    var onForkMessage = function(msg){
            //console.log(msg);
            // masterTotal += msg.total;
            // masterWins += msg.win;

            funName = msg.fun;
            for (var att in msg) {
                if (att === "detailedDateResult") {
                    var ddr = msg.detailedDateResult;
                    for (var _att in ddr) {
                        if (!masterDetailedDateResult[_att]) masterDetailedDateResult[_att] = {total:0, win:0};
                        masterDetailedDateResult[_att].total += ddr[_att].total;
                        masterDetailedDateResult[_att].win += ddr[_att].win;
                    }
                } else {
                    masterResult["master_"+att] = masterResult["master_"+att]?masterResult["master_"+att]+msg[att]:msg[att];
                }
            }

        }

    for (var i = 0; i < numCPUs; i++) {
        if (i*forkStocks >= stocksLen) break;
        var worker = cluster.fork({startIdx: i*forkStocks, endIdx: Math.min((i+1)*forkStocks, stocksLen)-1});        
        worker.on('message', onForkMessage);
    }

    cluster.on('exit', function(worker, code, signal) {
        i--;
        //console.log('worker ' + worker.process.pid + ' exits', code, masterWins, masterTotal);
        if (i==0) {
            var datearray = [];

            for (var att in masterDetailedDateResult) {

                if (masterDetailedDateResult[att].total > detailedDateResultTotalMin) {
                    datearray.push(att);
                }
                //if (detailedDateResult[att].total > 10) console.log(att, typeof detailedDateResult[att], detailedDateResult[att])
            }
            datearray.sort(function(d1, d2){
                d1 = new Date(d1);
                d2 = new Date(d2);
                if (d1>d2) return 1;
                if (d2>d1) return -1;
                return 0;
            });
            
            datearray.forEach(function(date){
                console.log(date, masterDetailedDateResult[date].win+"/"+masterDetailedDateResult[date].total,
                    (masterDetailedDateResult[date].win/masterDetailedDateResult[date].total).toFixed(3));
            });
            console.log("================\r\n");

            if (intersectionKLineForm) funName = klineForm+" && "+intersectionKLineForm;
            if (unionKLineForm) klineForm+" || "+unionKLineForm;
            for (var att in masterResult) {
                if (att.length>12 && att.indexOf("master_total")===0) {
                    var winatt = "master_win"+att.substring(12);
                    console.log(att.substring(13)+" "+masterResult[winatt]+"/"+masterResult[att]
                    +"="+(masterResult[winatt]/masterResult[att]).toFixed(10));
                }
            }
            

            console.log(funName, masterResult.master_win+"/"+masterResult.master_total
                +"="+(masterResult.master_win/masterResult.master_total).toFixed(3));
            console.timeEnd("run");
        }
    });

      
} else if (cluster.isWorker) {

    var klineformanalyser = require("../klineform/analyser").config({
        startDate: startDate,
        endDate: endDate
    });

    
    
    var klineutil = require("../klineutil");
    var forkResult = {total:0, win:0};
    //var forkTotal = 0;
    //var forkWins = 0;

    var startIdx = parseInt(process.env.startIdx, 10);
    var endIdx = parseInt(process.env.endIdx, 10);

    function dateToString(date) {
        var mth = date.getMonth()+1;
        return (mth>9?mth:"0"+mth)+"/"+date.getDate()+"/"+date.getFullYear();
    }

    

    function processStock(idx) {
        var stockId = stocks[idx];
        var fun = klineForm;
        var showLog = -1 !== stocksShowLog.indexOf(stockId);

        klineio.readKLine(stockId, function(kLineJson) {
            //10=56.14 / 12=58.86 / 15=61.63 / 20=64.22 / 30=66.44 /40=67.17
            // 30=52.5 / 50=58.3
            // 12=45.16
            //console.log("stockId", stockId, kLineJson[0].date, kLineJson[kLineJson.length-1].date)

            var result = klineformanalyser.traverseForWinning(fun, kLineJson, -0.05, 0.05, 100, 
                 {passAll:false, showLog:showLog, showLogDates:showLogDates, stockId:stockId,
                    union:unionKLineForm,
                    intersection:intersectionKLineForm,
                    injection: function(mtd, stockId, date, iswin){
                        //console.log(stockId, date, iswin)
                        if (dateSections.length===0) return;

                        var keytotal = "";
                        var keywin = "";
                        var seclen = dateSections.length;
                        if (date < dateSections[0]) {
                            var dstr = dateToString(dateSections[0]);
                            keytotal = "total_before_"+dstr;
                            keywin = "win_before_"+dstr;
                        } else if (date >= dateSections[seclen-1]) {
                            var dstr = dateToString(dateSections[seclen-1]);
                            keytotal = "total_after_"+dstr;
                            keywin = "win_after_"+dstr;
                        } else {
                            for (var i=1; i<dateSections.length; i++) {
                                if (date < dateSections[i]) {
                                    var startstr = dateToString(dateSections[i-1]);
                                    var endstr = dateToString(dateSections[i]);
                                    keytotal ="total_"+startstr + "_" + endstr;
                                    keywin = "win_"+startstr + "_" + endstr;
                                    break;
                                }
                            }
                        }
                        if (date>=detailedDateResultStart && date<=detailedDateResultEnd) {
                            var dstr = dateToString(date);
                            if (!detailedDateResult[dstr]) {
                                detailedDateResult[dstr]={total:0, win:0};
                            }

                            detailedDateResult[dstr].total++;
                            if (iswin) detailedDateResult[dstr].win++;
                        }

                        forkResult[keytotal] = forkResult[keytotal]?forkResult[keytotal]+1:1;
                        if(iswin) {
                            forkResult[keywin] = forkResult[keywin]?forkResult[keywin]+1:1;
                        }
                    }
                });

            forkResult.total += result.total;
            forkResult.win += result.win; 
            
            if (idx === endIdx) {
                forkResult.fun = fun;
                forkResult.detailedDateResult = detailedDateResult;
                process.send(forkResult);
                process.exit(0);
            } else {
                processStock(idx+1);
            }
        });

    }
    
    processStock(startIdx);    
}