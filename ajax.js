// The following ajax function assumes that all data sent and received is in
// the form of a json encoded object sent using an http POST.
function ajax(url, requestObject, responseHandler) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Browser not supported.');
        return;
    }
    httpRequest.onreadystatechange = function() {
        var responseObject;
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                if (httpRequest.responseText.trim().length === 0) {
                    responseHandler({});
                    return;
                }
                try {
                    responseObject = JSON.parse(httpRequest.responseText);
                } catch(e) {
                    responseHandler({ 
                        result: 'error', 
                        msg: 'JSON.parse exception.\n' + httpRequest.responseText
                    });
                }
                responseHandler(responseObject);
            } else {
                responseHandler({ result: 'error', msg: 'There was a problem with the request.'});
            }
        }
    };
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify(requestObject));
}