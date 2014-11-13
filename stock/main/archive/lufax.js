var webdriver = require('selenium-webdriver');
var ajaxRequest = require('request');

var userId = "1145923";
var availableFund = 0;
var minimumFundToLeftHigh = 9500;
var minimumFundToLeftLow = 1000;
var minInterest = 0.086;

var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();

var timeouts = (new webdriver.WebDriver.Timeouts(driver))
timeouts.setScriptTimeout(10000);
// var executor = webdriver.createExecutor("https://user.lufax.com/user/login?returnPostURL=http%3A%2F%2Fmy.lufax.com%2Fmy%2Faccount");
// for (var att in timeouts) {
//     console.log("==========", att);
// }
// var lct = driver.switchTo();
// for (var att in ajaxRequestJar) {
//     console.log(att)
// }
driver.get('https://user.lufax.com/user/login?returnPostURL=http%3A%2F%2Fmy.lufax.com%2Fmy%2Faccount');
var form = driver.findElement(webdriver.By.id('loginForm'));
var user = form.findElement(webdriver.By.id('userNameLogin'));
var password = form.findElement(webdriver.By.id('pwd'));
var validNum = form.findElement(webdriver.By.id('validNum'));

user.sendKeys("coolinker");
password.sendKeys("B3ijing19l");
validNum.sendKeys("");

//driver.executeAsyncScript(function(){alert('hi welcome')});


driver.wait(function() {

    return validNum.getAttribute('value').then(function(value) {
        return value.length === 4;
    });
}, Infinity);

driver.findElement(webdriver.By.id('loginBtn')).click();

driver.sleep(1000);

driver.wait(function() {
    console.log("asset-overview", new Date());
    var url = "https://my.lufax.com/my/service/users/" + userId + "/asset-overview";
    return driver.executeAsyncScript(function() {
        var url = arguments[arguments.length - 2];
        var callback = arguments[arguments.length - 1];
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr.responseText);
            }
        }
        xhr.send('');
    }, url).then(function(str) {
        var json = JSON.parse(str)
        availableFund= json.availableFund;
        console.log("Got availableFund:", availableFund);
        return true;
    });
}, 5000);

driver.sleep(1000);
driver.get("https://list.lufax.com/list/transfer");

driver.sleep(1000);

driver.wait(function() {
    console.log("counts-info", new Date());
    var url = "https://list.lufax.com/list/service/product/counts-info";
    return driver.executeAsyncScript(function() {
        var url = arguments[arguments.length - 2];
        var callback = arguments[arguments.length - 1];
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr.responseText);
            }
        }
        xhr.send('');
    }, url).then(function(str) {
        var json = JSON.parse(str)
        console.log("Got counts-info:", json.successInvestCounts);
        return true;
    });
}, 5000);


var productID, _productID;
var isAjaxRequesting = false;
var sessionHeartBeat = new Date();
var ajaxRequestingTime;
var pageNumber = 1;
var maxInterest = 0;

driver.wait(function() {
    
    if (new Date() - sessionHeartBeat > 300000) {
        driver.get('https://list.lufax.com/list/transfer');
        sessionHeartBeat = new Date();
        console.log("sessionHeartBeat", sessionHeartBeat)
    }

    if (isAjaxRequesting === false && (!ajaxRequestingTime || (new Date() - ajaxRequestingTime) > 500)) {

        isAjaxRequesting = true;
        ajaxRequestingTime = new Date();
        ajaxRequest({
                uri: "https://list.lufax.com/list/service/product/transfer-product-list/listing/"
                    +pageNumber+"?minAmount=0&maxAmount=100000000&tradingMode=&column=publishedAt&order=asc&isDefault=true",
                timeout: 2000
            },
            //https://list.lufax.com/list/service/product/transfer-product-list/listing/2?minAmount=0&maxAmount=100000000&column=publishedAt&tradingMode=&order=desc&isDefault=true&_=1404353632804

            function(error, response, body) {
                if (error) {
                    //console.log(error);
                } else if (response.statusCode == 200) {
                    var json = JSON.parse(body);
                    if (pageNumber<40 && json.currentPage<json.totalPage && pageNumber<json.totalPage) pageNumber++;
                    else {
                        pageNumber = 1;//json.totalPage-10;
                    }
                    var products = json.data;
                                      
                    products.forEach(function(product) {
                        var valueDate = Number(product.valueDate.substr(6,2));//=20140624
                        var currentDate = (new Date()).getDate();
                        var publishedTime = new Date(Date.parse(product.publishedAt+"T"+product.publishAtDateTime+"+0800"))
                        var adjustPrice = product.adjustPrice;

                        if(product.bidCurrentPrice === undefined && product.tradingMode === "06"
                            || product.bidCurrentPrice !== undefined && product.tradingMode !== "06") 
                            console.log("****************product.tradingMode=06", product.productId, product.adjustPrice)
                            
                        if (product.tradingMode === "06") {
                            if (new Date()-publishedTime<55*60*1000) return;
                            //console.log("product.tradingMode", product.tradingMode, new Date(), publishedTime, new Date()-publishedTime)
                            adjustPrice += product.bidCurrentPrice+10;

                        }    
                        //adjustPrice = adjustPrice;// - product.principal * (product.interestRate/12)*(adjustDays/30);

                        var _adjustInterest = adjustInterest(product.principal, adjustPrice, product.interestRate, product.numberOfInstalments)
                         var adjustDays = (currentDate + 30 - valueDate)%30;
                        _adjustInterest = _adjustInterest/(1- (adjustDays/30)/product.numberOfInstalments);
                        // if (adjustDays>20) console.log(adjustDays, (1- (adjustDays/30)/product.numberOfInstalments), _adjustInterest
                        //     , product.principal, adjustPrice);
                        
                        //availableFund = 1200000;

                        if (product.productStatus === "ONLINE" 
                            && _adjustInterest > minInterest
                            //&& product.price < availableFund
                            // &&(availableFund-product.price > minimumFundToLeftHigh
                            //     || availableFund-product.price < minimumFundToLeftLow)
                            ) {
                            maxInterest = _adjustInterest;
                            _productID = product.productId;
                            
                            console.log("PID********", pageNumber>=10?pageNumber:"0"+pageNumber, 
                                _productID, (_adjustInterest*100).toFixed(2), product.principal.toFixed(2), 
                                product.bidCurrentPrice!=undefined?" Bid: "+product.bidCurrentPrice:"",
                                product.adjustPrice?"Adj: "+product.adjustPrice:"", 
                                (((new Date())-publishedTime)/60000).toFixed(2),
                                product.valueDate.substr(0,8));
                            
                        }
                    })

                    if (json.currentPage===json.totalPage && _productID) {
                        //productID = _productID;
                    }

                }
                isAjaxRequesting = false;
            });
        //});
    }

    if (productID !== undefined) {
        console.log("get productID=======", productID);
        console.log(new Date());
        return true;
    } else {
        return false;
    }

}, Infinity);

var tradingSid;
driver.wait(function() {
    console.log("invest-check", new Date());
    var url = "https://list.lufax.com/list/service/users/"+userId+"/products/"+productID+"/invest-check"
    return driver.executeAsyncScript(function() {
        var url = arguments[arguments.length - 2];
        var callback = arguments[arguments.length - 1];
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr.responseText);
            }
        }
        xhr.send("source=0");
    }, url).then(function(str) {
        var json = JSON.parse(str)
        tradingSid = json.sid;
        console.log("Got sid:", tradingSid);
        return true;
    });
}, 5000);

// driver.wait(function() {
//     return driver.get("https://trading.lufax.com/trading/trade-info?productId="+productID+"&sid="+tradingSid)
//         .then(function(){ 
//             console.log("Got https://trading.lufax.com", new Date());
//             return true; 

//         });

// }, 5000);
driver.wait(function() {
    console.log("check-trace ......", new Date());
    var url = "https://trading.lufax.com/trading/service/trade/check-trace?sid="
        +tradingSid+"&productId="+productID+"&userId="+userId+"&curStep=TRADE_INFO"
        +"&_="+(new Date()).getTime();
    return driver.get(url).then(function(){
            console.log("check-trace: TRADE_INFO", new Date());
            return true; 
        });

}, 5000);

// driver.wait(function() {
//     console.log("check-trace", new Date());
//     var url = "https://trading.lufax.com/trading/service/trade/check-trace?sid="
//         +tradingSid+"&productId="+productID+"&userId="+userId+"&curStep=TRADE_INFO"
//         +"&_="+(new Date()).getTime();
//     return driver.executeAsyncScript(function() {
//         var url = arguments[arguments.length - 2];
//         var callback = arguments[arguments.length - 1];
//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", url, true);
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState == 4) {
//                 callback(xhr.responseText);
//             }
//         }
//         xhr.send('');
//     }, url).then(function(str) {
//         console.log("check-trace: TRADE_INFO", new Date(), str);
//         return true;
//     });
// }, 5000);

driver.wait(function() {
    console.log("trace-trace......", new Date());
    var url = "https://trading.lufax.com/trading/service/trade/trace";
    var postParam = "sid="+tradingSid+"&productId="+productID+"&curStep=TRADE_INFO";
    return driver.executeAsyncScript(function() {
        var url = arguments[arguments.length - 3];
        var postParam = arguments[arguments.length - 2];
        var callback = arguments[arguments.length - 1];
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr.responseText);
            }
        }
        
        xhr.send(postParam);
    }, url, postParam).then(function(str) {
        console.log("trace-trace: TRADE_INFO", new Date(), str);
        return true;
    });
}, 5000);

driver.wait(function() {
    console.log("check-trace......", new Date());
    var url = "https://trading.lufax.com/trading/service/trade/check-trace?sid="
        +tradingSid+"&productId="+productID+"&userId="+userId+"&curStep=CONTRACT"
        +"&_="+(new Date()).getTime();
    return driver.executeAsyncScript(function() {
        var url = arguments[arguments.length - 2];
        var callback = arguments[arguments.length - 1];
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr.responseText);
            }
        }
        xhr.send('');
    }, url).then(function(str) {
        console.log("check-trace: CONTRACT", new Date(), str);
        return true;
    });
}, 5000);


driver.wait(function() {
    console.log("trace-trace......", new Date());
    var url = "https://trading.lufax.com/trading/service/trade/trace";
    var postParam = "sid="+tradingSid+"&productId="+productID+"&curStep=CONTRACT";
    return driver.executeAsyncScript(function() {
        var url = arguments[arguments.length - 3];
        var postParam = arguments[arguments.length - 2];
        var callback = arguments[arguments.length - 1];
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(xhr.responseText);
            }
        }
        
        xhr.send(postParam);
    }, url, postParam).then(function(str) {
        console.log("trace-trace: CONTRACT", new Date(), str);
        return true;
    });
}, 5000);

var inputValidJY;
driver.wait(function() {
    driver.get("https://trading.lufax.com/trading/security-valid?productId="+productID+"&sid="+tradingSid);
    driver.findElement(webdriver.By.xpath("//input[@id='tradeCode']")).sendKeys("B3ijing19jy");
    inputValidJY = driver.findElement(webdriver.By.xpath("//input[@id='inputValid']"));
    return inputValidJY.sendKeys("").then(function(){
        console.log("waiting valid code...", new Date())
        return true;
    });

},5000);

driver.wait(function() {
    return inputValidJY.getAttribute('value').then(function(value) {
       return value.length===4;
    });

}, 10000);

driver.wait(function() {
     console.log("Find validBtn......", new Date())
    return driver.findElement(webdriver.By.xpath("//a[@id='validBtn']")).then(
        function(element){
            return element.click().then(
                        function(){
                            console.log("Finish========================click validBtn", new Date())
                            return true;
                        });
        }, function(error){
            console.log("findElement validBtn......", new Date())
            return false;
        });

}, 10000);



function math_power(x, y) {
    var result = 1;
    for (var i=0; i<y; i++) {
        result *= x; 
    }
    return result;
}

function payment_month(principal, interest_month, months) {
    return principal*interest_month*math_power((1+interest_month), months)/(
        math_power((1+interest_month), months)-1)
}


function adjustInterest(principal, adjustPrice, interest, months) {
    var paymentPerMonth = payment_month(principal, interest/12, months);
    var interestCeil = interest;
    var interestFloor = interest;
    while (paymentPerMonth < payment_month(principal+adjustPrice, interestFloor/12, months)) {
        interestCeil = interestFloor;
        interestFloor -= 0.001;
    }

    while (paymentPerMonth > payment_month(principal+adjustPrice, interestCeil/12, months)) {
        interestFloor = interestCeil;
        interestCeil += 0.001;
    }

    //console.log("start:", interestFloor, interestCeil);
    interest = interestCeil;
    var _count = 0;
    while(_count<15){
        _count++;
        var adjustedPaymentPerMonth = payment_month(principal+adjustPrice, interest/12, months);
        //console.log("---", interestFloor, interestCeil, adjustedPaymentPerMonth, paymentPerMonth)
        if (Math.round(adjustedPaymentPerMonth)-Math.round(paymentPerMonth) === 0) return interest;
        //if (_count===10) console.log(interest, adjustedPaymentPerMonth, paymentPerMonth)
        if (adjustedPaymentPerMonth > paymentPerMonth) {
            interest = (interestCeil+interestFloor)/2;
            interestCeil = interest;
        } else {
            interestFloor = interest;
            interest += 0.0005;
            interestCeil = interest;
        }
        
    }

    console.log("*******************", principal, adjustPrice, interest, months)
}