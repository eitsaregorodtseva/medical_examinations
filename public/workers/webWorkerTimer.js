let interval = 1000;

onmessage = function(e) {
    if (e.data !== '') {
        interval = e.data
    }
    setInterval(function() {
        postMessage('');
    }, interval);
};
