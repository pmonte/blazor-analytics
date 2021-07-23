// declare window globals
interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
}

// declare globals
declare const dataLayer: any[];
declare const gtag: (...args: any[]) => void;

// init globals
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { dataLayer.push(arguments); };

// configure first timestamp
gtag("js", new Date());

namespace GoogleAnalyticsInterop {
    export function configure(trackingId: string, debug: boolean = false): void {
        this.debug = debug;
        const script = document.createElement("script");
        script.async = true;

        if (trackingId.indexOf("GTM") == -1) script.src = "https://www.googletagmanager.com/gtag/js?id=" + trackingId;
        else script.text = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(), event: 'gtm.js'}); var f = d.getElementsByTagName(s)[0],j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src ='https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);})(window, document, 'script', 'dataLayer', '" + trackingId + "')";

        document.head.appendChild(script);

        if (trackingId.indexOf("GTM") == -1) gtag("config", trackingId, { 'send_page_view': false });

        if (this.debug) {
            console.log(`[GTAG][${trackingId}] Configured!`);
        }
    }

    export function navigate(trackingId: string, href: string): void {
        if (trackingId.indexOf("GTM") == -1) gtag("config", trackingId, { page_location: href });
        else {
            dataLayer.push({
                'event': 'page_view',
                'action': href
            });
        }

        if (this.debug) {
            console.log(`[GTAG][${trackingId}] Navigated: '${href}'`);
        }
    }

    export function trackEvent(eventName: string, eventData: object) {
        gtag("event", eventName, eventData);
        if (this.debug) {
            console.log(`[GTAG][Event triggered]: ${eventName}`);
        }
    }
    export function trackEventGTM(trackingId: string, eventName: string, eventCategory: string, eventLabel: string) {
        dataLayer.push({
            'event': 'eventTracking',
            'category': eventCategory,
            'action': eventName,
            'label': eventLabel
        });
        if (this.debug) {
            console.log(`[GTAG][Event triggered]: ${eventName}`);
        }
    }
}
