var Loading = (function () {
    var parallelsCount = 0,
        quiet = false;

    function isInternalCall(url) {
        var regex = /^((http(s?))\:\/\/)|(\.json)$/gi;
        return !regex.test(url);
    }

    function show(config) {
        if (config && isInternalCall(config.url)) return;
        parallelsCount++;
        // clog('show', parallelsCount, config.url, config.method);
        if (!quiet) {
            if (parallelsCount === 1) {
                $('.page-loading-container').css('display', 'flex');
            }
        }
    }

    function hide(config) {
        if (config && isInternalCall(config.url)) return;
        parallelsCount--;
        // clog('hide', parallelsCount, config.url, config.method);
        if (parallelsCount < 1) {
            $('.page-loading-container').hide();
            parallelsCount = 0;
            quiet = false;
        }
    }

    return {
        show: show,
        hide: hide,
        quiet: quiet
    };
})();