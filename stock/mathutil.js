function C(arr, num){
    var r=[];
    (function f(t,a,n){
        if (n==0) return r.push(t);
        for (var i=0,l=a.length; i<=l-n; i++){
            f(t.concat(a[i]), a.slice(i+1), n-1);
        }
    })([],arr,num);
    return r;
}

function CArr(n, r) {
    var arr = [];
    for (var i=0;i<n;i++) {
        arr.push(i);
    }
    return C(arr, r);
}

exports.CArr = CArr;