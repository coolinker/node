var webdriver = require('selenium-webdriver');
var ajaxRequest = require('request');

var userId = "1145923";
var userName = "";
var password = "";
var tradingPassword = "";

var availableFund = 0;
var minimumFundToLeftHigh = 9262;
var minimumFundToLeftLow = 1000;
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

user.sendKeys(userName);
password.sendKeys(password);
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
    var url = "https://my.lufax.com/my/service/users/" + userId + "/asset-overview?mytest=test";
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
    var url = "https://list.lufax.com/list/service/product/counts-info?jake=yes";
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


var productID;
var isAjaxRequesting = false;
var sessionHeartBeat = new Date();
var ajaxRequestingTime;

driver.wait(function() {
    
    if (new Date() - sessionHeartBeat > 300000) {
        driver.get('https://list.lufax.com/list/transfer');
        sessionHeartBeat = new Date();
        console.log("sessionHeartBeat", sessionHeartBeat)
    }

    if (!productID && isAjaxRequesting === false && (!ajaxRequestingTime || (new Date() - ajaxRequestingTime) > 500)) {

        isAjaxRequesting = true;
        ajaxRequestingTime = new Date();
        ajaxRequest({
                uri: "https://list.lufax.com/list/service/product/transfer-product-list/listing/1?column=publishedAt&order=asc&isDefault=true",
                timeout: 1000
            },
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else if (response.statusCode == 200) {
                    var json = JSON.parse(body);
                    var products = json.data;
                    var topPriceToBuy = 0;
                    if (products[0].productStatus !== "DONE") {
                        console.log(products[0].productStatus, products[0].price, topPriceToBuy, new Date())
                    }
                    products.forEach(function(product) {
                        if (product.productStatus === "ONLINE" 
                            && product.price <= availableFund
                            &&(availableFund-product.price > minimumFundToLeftHigh
                                 || availableFund-product.price < minimumFundToLeftLow)
                            && product.price > topPriceToBuy) {
                            topPriceToBuy = product.price;
                            productID = product.productId;
                            console.log("");
                            console.log("productID********", productID, topPriceToBuy);
                            console.log("");
                        }
                    })

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
    driver.findElement(webdriver.By.xpath("//input[@id='tradeCode']")).sendKeys(tradingPassword);
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

