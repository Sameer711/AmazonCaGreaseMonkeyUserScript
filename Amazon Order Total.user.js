// ==UserScript==
// @name         Amazon Order Total
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sum up the total amazon orders
// @author       Sameer
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @match        https://www.amazon.ca/gp/your-account/order-history*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


(function(jQuery) {
    'use strict';
    let inProgress = GM_getValue("AmazonOrderTotal_InProgress", false);
    if (inProgress) {
        getOrderTotal();
    } else {

        var getOrderTotalsButton = jQuery('<button/>',
                                          {
            text: 'Get Order Totals!',
            click: startTracking,
            class: 'a-button-primary'
        });

        jQuery(".top-controls").append(getOrderTotalsButton);

    }

    function startTracking() {
        GM_setValue("AmazonOrderTotal",0);
        GM_setValue("AmazonOrderTotal_InProgress", true);
        getOrderTotal();
    }

    function getOrderTotal() {
        let sum = GM_getValue("AmazonOrderTotal", 0);
        [].forEach.call(document.getElementsByClassName('value'),function(el) {

            if (el.innerText.startsWith('CDN$ ')) {

                //exclude refunds.. go up to the ancestor and look for refund text in block
                if (!$(el).parent().parent().parent().parent().parent().parent().parent().parent().siblings().text().includes("Refund")) {
                    console.log(el.innerText.substr(5));
                    sum+= parseFloat(el.innerText.substr(5));
                }
            }
        })
        GM_setValue("AmazonOrderTotal", sum);
        console.log(sum);
        if (jQuery('.a-last a').length > 0) {
            jQuery('.a-last a')[0].click();
        } else {
            GM_setValue("AmazonOrderTotal_InProgress", false);
            alert('Your total orders is: $' + sum.toFixed(2));
        }
    }

})(jQuery);