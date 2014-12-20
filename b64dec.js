/*
Copyright Vassilis Petroulias [DRDigit]
Licensed under the Apache License, Version 2.0;
*/
window.b64dec=function(){var d={b:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",a:null,f:/MSIE /.test(navigator.userAgent),e:/MSIE [67]/.test(navigator.userAgent),c:function(b){if(b.length%4)throw Error("InvalidCharacterError: 'B64.decode' failed: The string to be decoded is not correctly encoded.");b=d.d(b);var a=0,f=b.length;if(d.e){for(var c=[];a<f;)128>b[a]?c.push(String.fromCharCode(b[a++])):191<b[a]&&224>b[a]?c.push(String.fromCharCode((b[a++]&31)<<6|b[a++]&63)):c.push(String.fromCharCode((b[a++]&
15)<<12|(b[a++]&63)<<6|b[a++]&63));return c.join("")}for(c="";a<f;)c=128>b[a]?c+String.fromCharCode(b[a++]):191<b[a]&&224>b[a]?c+String.fromCharCode((b[a++]&31)<<6|b[a++]&63):c+String.fromCharCode((b[a++]&15)<<12|(b[a++]&63)<<6|b[a++]&63);return c},d:function(b){var a=-1,f,c=[],e=Array(4);if(!d.a){f=d.b.length;for(d.a={};++a<f;)d.a[d.b.charAt(a)]=a;a=-1}for(f=b.length;++a<f;){e[0]=d.a[b.charAt(a)];e[1]=d.a[b.charAt(++a)];c.push(e[0]<<2|e[1]>>4);e[2]=d.a[b.charAt(++a)];if(64==e[2])break;c.push((e[1]&
15)<<4|e[2]>>2);e[3]=d.a[b.charAt(++a)];if(64==e[3])break;c.push((e[2]&3)<<6|e[3])}return c}};return d.c}();
