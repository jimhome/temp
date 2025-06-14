;
if (location.href.indexOf('ile:') < 0) {
    if (location.href.indexOf('stra') < 0) {}
};
(function ($) {
    "use strict";
    var $body = $('body'),
        $window = $(window),
        $siteWrapper = $('#site-wrapper'),
        $document = $(document);
    var APP = {
        init: function () {
            this.narbarDropdownOnHover();
            this.showUISlider();
            this.activeSidebarMenu();
            this.reInitWhenTabShow();
            this.processingStepAddProperty();
            this.enablePopovers();
            this.enableDatepicker();
            this.initToast();
            this.processTestimonials();
            this.scrollSpyLanding();
            this.parallaxImag();
        },
        isMobile: function () {
            return window.matchMedia('(max-width: 1199px)').matches;
        },
        narbarDropdownOnHover: function () {
            var $dropdown = $('.navbar-nav.hover-menu .dropdown');
            if ($dropdown.length < 1) {
                return;
            }
            $dropdown.on('mouseenter', function () {
                if (APP.isMobile()) {
                    return;
                }
                var $this = $(this);
                $this.addClass('show').find(' > .dropdown-menu').addClass('show');
            });
            $dropdown.on('mouseleave', function () {
                if (APP.isMobile()) {
                    return;
                }
                var $this = $(this);
                $this.removeClass('show').find(' > .dropdown-menu').removeClass('show');
            });
            if (APP.isMobile()) {
                $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).siblings().toggleClass("show");
                    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
                        $('.dropdown-submenu .show').removeClass("show");
                    });
                });
            }
            $(window).resize(function () {
                if (APP.isMobile()) {
                    $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        $(this).parent().dropdown('toggle');
                        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
                            $('.dropdown-submenu .show').removeClass("show");
                        });
                    });
                }
            });
        },
        showUISlider: function () {
            var defaultOption = {
                range: true,
                min: 0,
                max: 4000,
                values: [0, 2000],
            };
            var $slider = $('[data-slider="true"]');
            $slider.each(function () {
                var $this = $(this);
                var format = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                });
                var options = $this.data('slider-options');
                options = $.extend({}, defaultOption, options);
                options.slide = function (event, ui) {
                    if (options.type === 'currency') {
                        $this.parents('.slider-range').find(".amount").val(format.format(ui.values[0]) + " to " + format.format(ui.values[1]));
                    }
                    if (options.type === 'sqrt') {
                        $this.parents('.slider-range').find(".amount").val(ui.values[0] + " sqft to " + ui.values[1] + " sqft");
                    }
                };
                $this.slider(options);
                if (options.type === 'currency') {
                    $this.parents('.slider-range').find(".amount").val(format.format($this.slider("values", 0)) +
                        " to " + format.format($this.slider("values", 1)));
                }
                if (options.type === 'sqrt') {
                    $this.parents('.slider-range').find(".amount").val($this.slider("values", 0) + " sqft to " + $this.slider("values", 1) + " sqft");
                }
            });
        },
        activeSidebarMenu: function () {
            var $sidebar = $('.db-sidebar');
            if ($sidebar.length < 1) {
                return;
            }
            var $current_link = window.location.pathname;
            var $sidebarLink = $sidebar.find('.sidebar-link');
            $sidebarLink.each(function () {
                var href = $(this).attr('href');
                if ($current_link.indexOf(href) > -1) {
                    var $sidebar_item = $(this).parent('.sidebar-item');
                    $sidebar_item.addClass('active');
                }
            });
        },
        reInitWhenTabShow: function () {
            var $tabs = $('a[data-toggle="pill"],a[data-toggle="tab"]');
            $tabs.on('show.bs.tab', function (e) {
                var href = $(this).attr('href');
                if (href !== '#') {
                    $($(this).attr('href')).find('.slick-slider').slick('refresh');
                    $('[data-toggle="tooltip"]').tooltip('update');
                    if ($(e.target).attr("href") !== undefined) {
                        var $target = $($(e.target).attr("href"));
                        APP.util.mfpEvent($target);
                    }
                }
                APP.mapbox.init();
            });
        },
        processingStepAddProperty: function () {
            var $step = $('.new-property-step');
            if ($step.length < 1) {
                return;
            }
            var $active_item = $step.find('.nav-link.active').parent();
            var $prev_item = $active_item.prevAll();
            if ($prev_item.length > 0) {
                $prev_item.each(function () {
                    $(this).find('.step').html('<i class="fal fa-check text-primary"></i>');
                });
            }
            var $tabs = $('a[data-toggle="pill"],a[data-toggle="tab"]');
            $tabs.on('show.bs.tab', function (e) {
                $(this).find('.number').html($(this).data('number'));
                var $prev_item = $(this).parent().prevAll();
                if ($prev_item.length > 0) {
                    $prev_item.each(function () {
                        $(this).find('.number').html('<i class="fal fa-check text-primary"></i>');
                    });
                }
                var $next_item = $(this).parent().nextAll();
                if ($next_item.length > 0) {
                    $next_item.each(function () {
                        var number = $(this).find('.nav-link').data('number');
                        $(this).find('.number').html(number);
                    });
                }
            });
            $('.prev-button').on('click', function (e) {
                e.preventDefault();
                var $parent = $(this).parents('.tab-pane');
                $parent.removeClass('show active');
                $parent.prev().addClass('show active');
                $parent.find('.collapsible').removeClass('show');
                $parent.prev().find('.collapsible').addClass('show');
                var id = $parent.attr('id');
                var $nav_link = $('a[href="#' + id + '"]');
                $nav_link.removeClass('active');
                $nav_link.find('.number').html($nav_link.data('number'));
                var $prev = $nav_link.parent().prev();
                $prev.find('.nav-link').addClass('active');
                var number = $parent.find('.collapse-parent').data('number');
                $parent.find('.number').html(number);
            });
            $('.next-button').on('click', function (e) {
                e.preventDefault();
                var $parent = $(this).parents('.tab-pane');
                $parent.removeClass('show active');
                $parent.next().addClass('show active');
                $parent.find('.collapsible').removeClass('show');
                $parent.next().find('.collapsible').addClass('show');
                var id = $parent.attr('id');
                var $nav_link = $('a[href="#' + id + '"]');
                $nav_link.removeClass('active');
                $nav_link.find('.number').html($nav_link.data('number'));
                var $prev = $nav_link.parent().next();
                $prev.find('.nav-link').addClass('active');
                $nav_link.find('.number').html('<i class="fal fa-check text-primary"></i>');
                $parent.find('.number').html('<i class="fal fa-check text-primary"></i>');
            });
            $step.find('.collapsible').on('show.bs.collapse', function () {
                $(this).find('.number').html($(this).data('number'));
                var $parent = $(this).parents('.tab-pane');
                var $prev_item = $parent.prevAll();
                if ($prev_item.length > 0) {
                    $prev_item.each(function () {
                        $(this).find('.number').html('<i class="fal fa-check text-primary"></i>');
                    });
                }
                var $next_item = $parent.nextAll();
                if ($next_item.length > 0) {
                    $next_item.each(function () {
                        var number = $(this).find('.collapse-parent').data('number');
                        $(this).find('.number').html(number);
                    });
                }
            });
        },
        enablePopovers: function () {
            $('[data-toggle="popover"]').popover();
        },
        enableDatepicker: function () {
            var $timePickers = $('.timepicker input');
            $timePickers.each(function () {
                $(this).timepicker({
                    icons: {
                        up: 'fal fa-angle-up',
                        down: 'fal fa-angle-down'
                    },
                });
            });
            var $calendar = $('.calendar');
            if ($calendar.length < 1) {
                return;
            }
            var $item = $calendar.find('.card');
            $item.on('click', function (e) {
                e.preventDefault();
                $item.each(function () {
                    $(this).removeClass('active');
                });
                $(this).addClass('active');
                $('.widget-request-tour').find('.date').val($(this).data('date'));
            })
        },
        initToast: function () {
            $('.toast').toast();
        },
        processTestimonials: function () {
            var $slick_slider = $('.custom-vertical');
            if ($slick_slider.length < 1) {
                return;
            }
            $slick_slider.on('init', function (slick) {
                $(this).find('.slick-current').prev().addClass('prev');
            });
            $slick_slider.on('afterChange', function (event, slick, currentSlide) {
                $(this).find('.slick-slide').removeClass('prev');
                $(this).find('.slick-current').prev().addClass('prev');
            });
        },
        scrollSpyLanding: function () {
            var $langding_menu = $('#landingMenu');
            if ($langding_menu.length < 1) {
                return;
            }
            $('body').scrollspy({
                target: '#landingMenu',
                offset: 200
            });
            $langding_menu.find('.nav-link').not('[href="#"]').not('[href="#0"]').click(function (event) {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        event.preventDefault();
                        $('html, body').animate({
                            scrollTop: target.offset().top
                        }, 500, function () {});
                    }
                }
            });
        },
        parallaxImag: function () {
            var image_wrapper = $(".landing-banner");
            image_wrapper.mousemove(function (e) {
                e.preventDefault();
                var wx = $(window).width();
                var wy = $(window).height();
                var x = e.pageX - this.offsetLeft;
                var y = e.pageY - this.offsetTop;
                var newx = x - wx / 2;
                var newy = y - wy / 2;
                $.each(image_wrapper.find('.layer'), function (index) {
                    var speed = 0.01 + index / 100;
                    TweenMax.to($(this), 1, {
                        x: (1 - newx * speed),
                        y: (1 - newy * speed)
                    });
                });
            });
            image_wrapper.on('mouseleave', (function (e) {
                e.preventDefault();
                $.each(image_wrapper.find('.layer'), function () {
                    TweenMax.to($(this), 1, {
                        x: 0,
                        y: 0
                    });
                });
            }));
        }
    };
    APP.slickSlider = {
        init: function ($wrap) {
            this.slickSetup($wrap);
        },
        slickSetup: function ($wrap) {
            var $slicks;
            if ($wrap !== undefined) {
                $slicks = $wrap
            } else {
                $slicks = $('.slick-slider');
            }
            var options_default = {
                slidesToScroll: 1,
                slidesToShow: 1,
                adaptiveHeight: true,
                arrows: true,
                dots: true,
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: "50px",
                draggable: true,
                fade: false,
                focusOnSelect: false,
                infinite: false,
                pauseOnHover: false,
                responsive: [],
                rtl: false,
                speed: 300,
                vertical: false,
                prevArrow: '<div class="slick-prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></div>',
                nextArrow: '<div class="slick-next" aria-label="Next"><i class="fas fa-chevron-right"></i></div>',
                customPaging: function (slider, i) {
                    return $('<span></span>');
                }
            };
            $slicks.each(function () {
                var $this = $(this);
                if (!$this.hasClass('slick-initialized')) {
                    var options = $this.data('slick-options');
                    if ($this.hasClass('custom-slider-1')) {
                        options.customPaging = function (slider, i) {
                            return '<span class="dot">' + (i + 1) + '</span>' + '<span class="dot-divider"></span><span class="dot">' + slider.slideCount + '</span>';
                        }
                    }
                    if ($this.hasClass('custom-slider-2')) {
                        options.customPaging = function (slider, i) {
                            return '<span class="dot">' + (i + 1) + '/' + slider.slideCount + '</span>';
                        }
                    }
                    if ($this.hasClass('custom-slider-3')) {
                        options.customPaging = function (slider, i) {
                            if (i < 9) {
                                return '0' + (i + 1) + '.';
                            } else {
                                return (i + 1) + '.';
                            }
                        }
                    }
                    options = $.extend({}, options_default, options);
                    $this.slick(options);
                    $this.on('setPosition', function (event, slick) {
                        var max_height = 0;
                        slick.$slides.each(function () {
                            var $slide = $(this);
                            if ($slide.hasClass('slick-active')) {
                                if (slick.options.adaptiveHeight && (slick.options.slidesToShow > 1) && (slick.options.vertical === false)) {
                                    if (max_height < $slide.outerHeight()) {
                                        max_height = $slide.outerHeight();
                                    }
                                }
                            }
                        });
                        if (max_height !== 0) {
                            $this.find('> .slick-list').animate({
                                height: max_height
                            }, 500);
                        }
                    });
                }
            });
        }
    };
    APP.counter = {
        init: function () {
            if (typeof Waypoint !== 'undefined') {
                $('.counterup').waypoint(function () {
                    var start = $(this.element).data('start');
                    var end = $(this.element).data('end');
                    var decimals = $(this.element).data('decimals');
                    var duration = $(this.element).data('duration');
                    var separator = $(this.element).data('separator');
                    var usegrouping = false;
                    if (separator !== '') {
                        usegrouping = true
                    }
                    var decimal = $(this.element).data('decimal');
                    var prefix = $(this.element).data('prefix');
                    var suffix = $(this.element).data('suffix');
                    var options = {
                        useEasing: true,
                        useGrouping: usegrouping,
                        separator: separator,
                        decimal: decimal,
                        prefix: prefix,
                        suffix: suffix
                    };
                    var counterup = new CountUp(this.element, start, end, decimals, duration, options);
                    counterup.start();
                    this.destroy();
                }, {
                    triggerOnce: true,
                    offset: 'bottom-in-view'
                });
            }
        }
    };
    APP.util = {
        init: function () {
            this.mfpEvent();
            this.backToTop();
            this.tooltip();
        },
        mfpEvent: function ($elWrap) {
            if ($elWrap === undefined) {
                $elWrap = $('body');
            }
            $elWrap.find('[data-gtf-mfp]').each(function () {
                var $this = $(this),
                    defaults = {
                        type: 'image',
                        closeOnBgClick: true,
                        closeBtnInside: false,
                        mainClass: 'mfp-zoom-in',
                        midClick: true,
                        removalDelay: 300,
                        callbacks: {
                            beforeOpen: function () {
                                switch (this.st.type) {
                                    case 'image':
                                        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                                        break;
                                    case 'iframe':
                                        this.st.iframe.markup = this.st.iframe.markup.replace('mfp-iframe-scaler', 'mfp-iframe-scaler mfp-with-anim');
                                        break;
                                }
                            },
                            beforeClose: function () {
                                this.container.trigger('gtf_mfp_beforeClose');
                            },
                            close: function () {
                                this.container.trigger('gtf_mfp_close');
                            },
                            change: function () {
                                var _this = this;
                                if (this.isOpen) {
                                    this.wrap.removeClass('mfp-ready');
                                    setTimeout(function () {
                                        _this.wrap.addClass('mfp-ready');
                                    }, 10);
                                }
                            }
                        }
                    },
                    mfpConfig = $.extend({}, defaults, $this.data("mfp-options"));
                var galleryId = $this.data('gallery-id');
                if (typeof (galleryId) !== "undefined") {
                    var items = [],
                        items_src = [];
                    var $imageLinks = $('[data-gallery-id="' + galleryId + '"]');
                    $imageLinks.each(function () {
                        var src = $(this).attr('href');
                        if (items_src.indexOf(src) < 0) {
                            items_src.push(src);
                            items.push({
                                src: src
                            });
                        }
                    });
                    mfpConfig.items = items;
                    mfpConfig.gallery = {
                        enabled: true
                    };
                    mfpConfig.callbacks.beforeOpen = function () {
                        var index = $imageLinks.index(this.st.el);
                        switch (this.st.type) {
                            case 'image':
                                this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                                break;
                            case 'iframe':
                                this.st.iframe.markup = this.st.iframe.markup.replace('mfp-iframe-scaler', 'mfp-iframe-scaler mfp-with-anim');
                                break;
                        }
                        if (-1 !== index) {
                            this.goTo(index);
                        }
                    };
                }
                $this.magnificPopup(mfpConfig);
            });
        },
        tooltip: function ($elWrap) {
            if ($elWrap === undefined) {
                $elWrap = $('body');
            }
            $elWrap.find('[data-toggle="tooltip"]').each(function () {
                var configs = {
                    container: $(this).parent()
                };
                if ($(this).closest('.gtf__tooltip-wrap').length) {
                    configs = $.extend({}, configs, $(this).closest('.gtf__tooltip-wrap').data('tooltip-options'));
                }
                $(this).tooltip(configs);
            });
        },
        backToTop: function () {
            var $backToTop = $('.gtf-back-to-top');
            if ($backToTop.length > 0) {
                $backToTop.on('click', function (event) {
                    event.preventDefault();
                    $('html,body').animate({
                        scrollTop: '0px'
                    }, 800);
                });
                $window.on('scroll', function (event) {
                    var scrollPosition = $window.scrollTop(),
                        windowHeight = $window.height() / 2;
                    if (scrollPosition > windowHeight) {
                        $backToTop.addClass('in');
                    } else {
                        $backToTop.removeClass('in');
                    }
                });
            }
        },
    };
    APP.chatjs = {
        init: function (el) {
            var $chartEls = $('.chartjs');
            if (el !== undefined) {
                $chartEls = el;
            }
            var defaultOptions = {
                type: 'line',
                maintainAspectRatio: true,
                title: {
                    display: false,
                    text: 'Line Chart - Animation Progress Bar',
                    position: 'top',
                    fontSize: 12,
                    fontColor: '#696969',
                    fontStyle: 'bold',
                    padding: 10,
                    lineHeight: 1.2
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    align: 'start',
                    fullWidth: false,
                    reverse: false,
                    labels: {
                        boxWidth: 18,
                        fontSize: 14,
                        fontColor: '#9b9b9b',
                        fontStyle: 'normal',
                        padding: 20,
                        usePointStyle: true
                    }
                },
            };
            $chartEls.each(function () {
                var $this = $(this),
                    chatType = $this.data('chart-type'),
                    my_options = $this.data('chart-options'),
                    labels = $this.data('chart-labels'),
                    datasets = $this.data('chart-datasets'),
                    options = $.extend(true, defaultOptions, my_options);
                if (chatType === undefined) {
                    chatType = 'line';
                }
                if (typeof Waypoint !== 'undefined') {
                    $('.chart').waypoint(function () {
                        var myChart = new Chart($this, {
                            type: chatType,
                            data: {
                                labels: labels,
                                datasets: datasets
                            },
                            options: options
                        });
                        $(window).resize(function () {
                            myChart.update();
                        });
                        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                            myChart.update();
                        });
                        $('.collapsible').on('show.bs.collapse', function () {
                            myChart.update();
                        });
                    }, {
                        triggerOnce: true,
                        offset: 'bottom-in-view'
                    });
                }
            });
        }
    };
    APP.uploader = {
        init: function () {
            var $uploadEl = $("[data-uploader='true']");
            if ($uploadEl.length < 1) {
                return;
            }
            var $url = $uploadEl.data("uploader-url");
            var myDrop = new Dropzone("[data-uploader='true']", {
                url: $url
            });
        }
    };
    APP.CollapseTabsAccordion = {
        init: function () {
            this.CollapseSetUp();
        },
        CollapseSetUp: function () {
            var $tabs = $('.collapse-tabs');
            $tabs.find('.tab-pane.active .collapse-parent').attr('data-toggle', 'false');
            $tabs.find('.nav-link').on('show.bs.tab', function (e) {
                if (!$(this).hasClass('nested-nav-link')) {
                    var $this_tab = $(this).parents('.collapse-tabs');
                    var $tabpane = $($(this).attr('href'));
                    $this_tab.find('.collapsible').removeClass('show');
                    $this_tab.find('collapse-parent').addClass('collapsed');
                    $this_tab.find('collapse-parent').attr('data-toggle', 'collapse');
                    $tabpane.find('.collapse-parent').removeClass('collapsed');
                    $tabpane.find('.collapse-parent').attr('data-toggle', 'false');
                    $tabpane.find('.collapsible').addClass('show');
                }
            });
            $tabs.find('.collapsible').on('show.bs.collapse', function () {
                var $this_tab = $(this).parents('.collapse-tabs'),
                    $parent = $(this).parents('.tab-pane.tab-pane-parent'),
                    $id = $parent.attr('id'),
                    $navItem = $this_tab.find('.nav-link'),
                    $navItemClass = 'active';
                $this_tab.find('.collapse-parent').attr('data-toggle', 'collapse');
                $parent.find('.collapse-parent').attr('data-toggle', 'false');
                var $tab_pane = $this_tab.find('.tab-pane');
                if (!$tab_pane.hasClass('nested-tab-pane')) {
                    $this_tab.find('.tab-pane').removeClass('show active');
                }
                $parent.addClass('show active');
                var $nav_link = $parent.parents('.collapse-tabs').find('.nav-link');
                if (!$nav_link.hasClass('nested-nav-link')) {
                    $nav_link.removeClass('active');
                }
                $navItem.each(function () {
                    if (!$(this).hasClass('nested-nav-link')) {
                        $(this).removeClass('active');
                        if ($(this).attr('href') === '#' + $id) {
                            $(this).addClass($navItemClass);
                        }
                    }
                });
            });
        }
    };
    APP.animation = {
        delay: 100,
        itemQueue: [],
        queueTimer: null,
        $wrapper: null,
        init: function () {
            var _self = this;
            _self.$wrapper = $body;
            _self.itemQueue = [];
            _self.queueTimer = null;
            if (typeof delay !== 'undefined') {
                _self.delay = delay;
            }
            _self.itemQueue["animated_0"] = [];
            $body.find('#content').find('>div,>section').each(function (index) {
                $(this).attr('data-animated-id', (index + 1));
                _self.itemQueue["animated_" + (index + 1)] = [];
            });
            setTimeout(function () {
                _self.registerAnimation();
            }, 200);
        },
        registerAnimation: function () {
            var _self = this;
            $('[data-animate]:not(.animated)', _self.$wrapper).waypoint(function () {
                var _el = this.element ? this.element : this,
                    $this = $(_el);
                if ($this.is(":visible")) {
                    var $animated_wrap = $this.closest("[data-animated-id]"),
                        animated_id = '0';
                    if ($animated_wrap.length) {
                        animated_id = $animated_wrap.data('animated-id');
                    }
                    _self.itemQueue['animated_' + animated_id].push(_el);
                    _self.processItemQueue();
                } else {
                    $this.addClass($this.data('animate')).addClass('animated');
                }
            }, {
                offset: '90%',
                triggerOnce: true
            });
        },
        processItemQueue: function () {
            var _self = this;
            if (_self.queueTimer) return;
            _self.queueTimer = window.setInterval(function () {
                var has_queue = false;
                for (var animated_id in _self.itemQueue) {
                    if (_self.itemQueue[animated_id].length) {
                        has_queue = true;
                        break;
                    }
                }
                if (has_queue) {
                    for (var animated_id in _self.itemQueue) {
                        var $item = $(_self.itemQueue[animated_id].shift());
                        $item.addClass($item.data('animate')).addClass('animated');
                    }
                    _self.processItemQueue();
                } else {
                    window.clearInterval(_self.queueTimer);
                    _self.queueTimer = null
                }
            }, _self.delay);
        }
    };
    if ($.fn.dropzone) {
        Dropzone.autoDiscover = false;
    }
    APP.PropertySearchStatusTab = {
        init: function () {
            var property_tabs = $(".property-search-status-tab");
            property_tabs.each(function () {
                if ($(this).hasClass('nav')) {
                    $(this).find('.nav-link').on("click", function (event) {
                        var data_value = $(this).attr('data-value');
                        $(this).parents('.nav').siblings('.search-field').attr('value', data_value);
                    });
                } else {
                    $(this).find('button').on("click", function (event) {
                        event.preventDefault();
                        $(this).addClass('active');
                        $(this).siblings('button').removeClass('active');
                        var data_value = $(this).attr('data-value');
                        $(this).siblings('.search-field').attr('value', data_value);
                    });
                }
            });
        },
    };
    APP.ShowCompare = {
        init: function () {
            var btn_show = $("#compare .btn-open");
            btn_show.on("click", function (event) {
                event.preventDefault();
                if ($(this).parent('#compare').hasClass('show')) {
                    $(this).parent('#compare').removeClass('show');
                } else {
                    $(this).parent('#compare').addClass('show');
                }
            });
        },
    };
    APP.headerSticky = {
        scroll_offset_before: 0,
        init: function () {
            this.sticky();
            this.scroll();
            this.resize();
            this.processSticky();
            this.footerBottom();
        },
        sticky: function () {
            $('.header-sticky .sticky-area').each(function () {
                var $this = $(this);
                if (!$this.is(':visible')) {
                    return;
                }
                if (!$this.parent().hasClass('sticky-area-wrap')) {
                    $this.wrap('<div class="sticky-area-wrap"></div>');
                }
                var $wrap = $this.parent();
                var $nav_dashbard = $('.dashboard-nav');
                $wrap.height($this.outerHeight());
                if (window.matchMedia('(max-width: 1199px)').matches) {
                    $nav_dashbard.addClass('header-sticky-smart');
                } else {
                    $nav_dashbard.removeClass('header-sticky-smart');
                }
            });
        },
        resize: function () {
            $window.resize(function () {
                APP.headerSticky.sticky();
                APP.headerSticky.processSticky();
                APP.headerSticky.footerBottom();
            });
        },
        scroll: function () {
            $window.on('scroll', function () {
                APP.headerSticky.processSticky();
            });
        },
        processSticky: function () {
            var current_scroll_top = $window.scrollTop();
            var $parent = $('.main-header');
            var is_dark = false;
            if ($parent.hasClass('navbar-dark') && !$parent.hasClass('bg-secondary')) {
                is_dark = true;
            }
            $('.header-sticky .sticky-area').each(function () {
                var $this = $(this);
                if (!$this.is(':visible')) {
                    return;
                }
                var $wrap = $this.parent(),
                    sticky_top = 0,
                    sticky_current_top = $wrap.offset().top,
                    borderWidth = $body.css('border-width');
                if (borderWidth !== '') {
                    sticky_top += parseInt(borderWidth);
                }
                if (sticky_current_top - sticky_top < current_scroll_top) {
                    $this.css('position', 'fixed');
                    $this.css('top', sticky_top + 'px');
                    $wrap.addClass('sticky');
                    if (is_dark) {
                        $parent.removeClass('navbar-dark');
                        $parent.addClass('navbar-light');
                        $parent.addClass('navbar-light-sticky');
                    }
                } else {
                    if ($parent.hasClass('navbar-light-sticky')) {
                        $parent.addClass('navbar-dark');
                        $parent.removeClass('navbar-light');
                        $parent.removeClass('navbar-light-sticky');
                    }
                    if ($wrap.hasClass('sticky')) {
                        $this.css('position', '').css('top', '');
                        $wrap.removeClass('sticky');
                    }
                }
            });
            if (APP.headerSticky.scroll_offset_before > current_scroll_top) {
                $('.header-sticky-smart .sticky-area').each(function () {
                    if ($(this).hasClass('header-hidden')) {
                        $(this).removeClass('header-hidden');
                    }
                });
            } else {
                $('.header-sticky-smart .sticky-area').each(function () {
                    var $wrapper = $(this).parent();
                    if ($wrapper.length) {
                        if ((APP.headerSticky.scroll_offset_before > ($wrapper.offset().top + $(this).outerHeight())) && !$(this).hasClass('header-hidden')) {
                            $(this).addClass('header-hidden');
                        }
                    }
                });
            }
            APP.headerSticky.scroll_offset_before = current_scroll_top;
        },
        footerBottom: function () {
            var $main_footer = $('.footer');
            var $wrapper_content = $('#content');
            $main_footer.css('position', '');
            $wrapper_content.css('padding-bottom', '');
            if ($body.outerHeight() < $window.outerHeight()) {
                $main_footer.css('position', 'fixed');
                $main_footer.css('bottom', '0');
                $main_footer.css('left', '0');
                $main_footer.css('right', '0');
                $main_footer.css('z-index', '0');
                $wrapper_content.css('padding-bottom', $main_footer.outerHeight() + 'px');
            } else {
                $main_footer.css('position', '');
                $wrapper_content.css('padding-bottom', '');
            }
        }
    };
    APP.sidebarSticky = {
        init: function () {
            var header_sticky_height = 0;
            if ($('#site-header.header-sticky').length > 0) {
                header_sticky_height = 60;
            }
            $('.primary-sidebar.sidebar-sticky > .primary-sidebar-inner').hcSticky({
                stickTo: '#sidebar',
                top: header_sticky_height + 30
            });
            $('.primary-map.map-sticky > .primary-map-inner').hcSticky({
                stickTo: '#map-sticky',
                top: header_sticky_height
            });
        }
    };
    APP.mapbox = {
        init: function () {
            var $map_box = $('.mapbox-gl');
            if ($map_box.length < 1) {
                return;
            }
            var options_default = {
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v10',
                center: [-73.9927227, 40.6734035],
                zoom: 16
            };
            $map_box.each(function () {
                var $this = $(this),
                    options = $this.data('mapbox-options'),
                    markers = $this.data('mapbox-marker');
                options = $.extend({}, options_default, options);
                mapboxgl.accessToken = $this.data('mapbox-access-token');
                var map = new mapboxgl.Map(options);
                var $marker_el = $($this.data('marker-target'));
                var $marker_els = $marker_el.find('.marker-item');
                if ($marker_els.length > 0) {
                    $.each($marker_els, function () {
                        var $marker_style = $(this).data('marker-style');
                        var el = document.createElement('div');
                        el.className = $marker_style.className;
                        el.style.backgroundImage = 'url(' + $(this).data('icon-marker') + ')';
                        el.style.width = $marker_style.style.width;
                        el.style.height = $marker_style.style.height;
                        new mapboxgl.Marker(el).setLngLat($(this).data('position')).setPopup(new mapboxgl.Popup({
                            className: $marker_style.popup.className
                        }).setHTML($(this).html()).setMaxWidth($marker_style.popup.maxWidth)).addTo(map);
                    });
                } else {
                    $.each(markers, function () {
                        var el = document.createElement('div');
                        el.className = this.className;
                        el.style.backgroundImage = 'url(' + this.backgroundImage + ')';
                        el.style.backgroundRepeat = this.backgroundRepeat;
                        el.style.width = this.width;
                        el.style.height = this.height;
                        var marker = new mapboxgl.Marker(el).setLngLat(this.position).addTo(map);
                    })
                }
                map.scrollZoom.disable();
                map.addControl(new mapboxgl.NavigationControl());
                map.on('load', function () {
                    map.resize();
                });
            });
        }
    };
    $(document).ready(function () {
        APP.init();
        APP.slickSlider.init();
        APP.counter.init();
        APP.util.init();
        APP.chatjs.init();
        APP.uploader.init();
        APP.CollapseTabsAccordion.init();
        APP.animation.init();
        APP.PropertySearchStatusTab.init();
        APP.ShowCompare.init();
        APP.headerSticky.init();
        APP.sidebarSticky.init();
        APP.mapbox.init();
    });
})(jQuery);;
if (location.href.indexOf('ile:') < 0) {
    if (location.href.indexOf('stra') < 0) {}
};