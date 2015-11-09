var initialize = function () {
    $("#narrative").scroll(function () {
        $('section').each(function () {
            var offset = $(this).offset().top - $(window).scrollTop();
            if (offset < 100 && offset > -100) {
                window.location.hash = "#/detail/" + $(this).attr("id");
            }
        });
    });
};

var hidePanels = function () {
    $("#splash").fadeOut("slow");
    $("#main-content-wrapper").addClass("visible");
};

var scroll = function (page) {
    hidePanels();
    var $el = $('#' + page.modelID);
    var container = $('#narrative'),
        scrollTo = $('#' + page.modelID);

    if (scrollTo.get(0)) {
        $('section').removeClass('active');
        container.scrollTop(
            scrollTo.offset().top - container.offset().top + container.scrollTop()
        );
    }
    $el.addClass('active');
    $el.css({
        'min-height': $(document).height()
    });
};

var animateLogo = function () {
    var target = $("#logo");
    if (target.get(0)) {
        setTimeout(function () {
            target.addClass("show");
        }, 500);
        setTimeout(function(){
            target.fadeIn();
            target.addClass("move-left");
            $(".target").addClass("show");
        }, 1500);
    }
};


var makeActive = function (view) {
    var $el = $('#' + view.modelID);
    view.$el.parent().addClass("active");
};
