"use strict";

function initFloatPlaceholderInput(selector) {
  if (selector) {
    jQuery(selector).each(function () {
      if (!jQuery(this).parent(".input-floating-wrap").length) {
        jQuery(this).wrap('<span class="input-floating-wrap"></span>');
        let placeholder = jQuery(this).attr("placeholder");
        if (!placeholder) {
          placeholder = "Select";
        }
        if (
          jQuery(this).prop("tagName").toLowerCase() == "select" &&
          jQuery(this).closest(".form-row").length
        ) {
          placeholder = jQuery(this).attr("data-placeholder");
        }
        jQuery(this).after(
          '<span class="floating-placeholder">' + placeholder + "</span>"
        );
      }
    });
  } else {
    const inputs = [
      '.wpforms-form input[placeholder]:not([placeholder=""])',
      '.wpforms-form textarea[placeholder]:not([placeholder=""])',
      '.woocommerce input[placeholder]:not([placeholder=""]):not(.qty):not(.woocommerce-Input[type="password"]):not(.search-form-field)',
      '.woocommerce textarea[placeholder]:not([placeholder=""])',
      '.post-comments-wrapper input[placeholder]:not([placeholder=""])',
      '.post-comments-wrapper textarea[placeholder]:not([placeholder=""])',
      '.mc4wp-form input[placeholder]:not([placeholder=""])',
      '.mc4wp-form textarea[placeholder]:not([placeholder=""])',
      '.neuros-no-result-search-form input[placeholder]:not([placeholder=""])',
      '.wp-block-search .wp-block-search__input[placeholder]:not([placeholder=""])',
      ".wpforms-form select:has(option.placeholder)",
      ".woocommerce form .form-row select",
    ];
    const $inputs = jQuery(inputs.join(", "));
    $inputs.each(function () {
      if (!jQuery(this).parent(".input-floating-wrap").length) {
        jQuery(this).wrap('<span class="input-floating-wrap"></span>');
        let placeholder = jQuery(this).attr("placeholder");
        if (!placeholder) {
          placeholder = "Select";
        }
        if (
          jQuery(this).prop("tagName").toLowerCase() == "select" &&
          jQuery(this).closest(".form-row").length
        ) {
          placeholder = jQuery(this).attr("data-placeholder");
        }
        jQuery(this).after(
          '<span class="floating-placeholder">' + placeholder + "</span>"
        );
      }
    });
  }
}

function side_panel_open() {
  jQuery(".dropdown-trigger").on("click", function () {
    jQuery(".slide-sidebar-wrapper, .body-overlay").addClass("active");
  });
  jQuery(".slide-sidebar-close, .body-overlay").on("click", function () {
    jQuery(".slide-sidebar-wrapper, .body-overlay").removeClass("active");
    jQuery(".dropdown-trigger .dropdown-trigger-item").removeClass("active");
  });
}
side_panel_open();

function extra_panel_open() {
  jQuery(".extra-trigger").on("click", function () {
    jQuery(".slide-extra-wrapper, .body-overlay").addClass("active");
  });
  jQuery(".slide-extra-close, .body-overlay").on("click", function () {
    jQuery(".slide-extra-wrapper, .body-overlay").removeClass("active");
  });
}
extra_panel_open();

function search_panel_open() {
  jQuery(".search-trigger").on("click", function () {
    jQuery(".site-search, .body-overlay").addClass("active");
    jQuery(".site-search .search-form .search-form-field").focus();
  });
  jQuery(".site-search-close, .body-overlay").on("click", function () {
    jQuery(
      ".site-search, .body-overlay, .mobile-header-menu-container"
    ).removeClass("active");
  });
}
search_panel_open();

function switch_form_columns() {
  jQuery(".tab-columns-switcher").on("click", function () {
    jQuery(".tab-column", jQuery(this).parents(".tab-columns")).toggleClass(
      "hidden"
    );
  });
}
switch_form_columns();

function sticky_menu_active(once) {
  if (jQuery(".sticky-header").length) {
    jQuery(".sticky-header").each(function () {
      const obj = jQuery(this);
      const header = obj.next(".sticky-header-on");
      const el_offset = header.offset().top + header.innerHeight();

      if (once) {
        const st = jQuery(window).scrollTop();
        if (st <= el_offset) {
          obj.removeClass("sticky-active");
        } else {
          obj.addClass("sticky-active");
        }
      }

      jQuery(window).scroll(function () {
        const st = jQuery(this).scrollTop();
        if (st <= el_offset) {
          obj.removeClass("sticky-active");
        } else {
          obj.addClass("sticky-active");
        }
      });
    });
  }
}
sticky_menu_active(true);

function menu_text_animate() {
  jQuery(".header .main-menu > li > a").wrapInner(
    '<span class="text-active"></span>'
  );
  jQuery(".header .main-menu > li > a > span.text-active").each(function () {
    jQuery(this)
      .clone()
      .removeClass("text-active")
      .appendTo(jQuery(this).parent());
  });
}

function mobile_menu_open() {
  jQuery(".menu-trigger").on("click", function () {
    jQuery(".mobile-header-menu-container, .body-overlay").addClass("active");
  });
  jQuery(".menu-close, .body-overlay").on("click", function () {
    jQuery(".mobile-header-menu-container, .body-overlay").removeClass(
      "active"
    );
  });
}
mobile_menu_open();

function simple_sidebar_open() {
  jQuery(".simple-sidebar-trigger").on("click", function () {
    if (jQuery(window).width() < 992) {
      jQuery(".simple-sidebar, .body-overlay").addClass("active");
    }
  });
  jQuery(".shop-hidden-sidebar-close, .body-overlay").on("click", function () {
    jQuery(".simple-sidebar, .body-overlay").removeClass("active");
  });
}
simple_sidebar_open();

function widget_list_hierarchy_init() {
  widget_archives_hierarchy_controller(
    ".widget .wp-block-page-list li",
    "ul.wp-block-navigation__submenu-container",
    "parent-archive",
    "widget-archive-trigger"
  );
  widget_archives_hierarchy_controller(
    ".widget ul li",
    "ul.children",
    "parent-archive",
    "widget-archive-trigger"
  );
  widget_archives_hierarchy_controller(
    ".widget_nav_menu .menu li",
    "ul.sub-menu",
    "parent-archive",
    "widget-menu-trigger"
  );
  widget_archives_hierarchy_controller(
    ".widget_neuros_nav_menu_widget .menu li",
    "ul.sub-menu",
    "parent-archive",
    "widget-menu-trigger"
  );
}

function widget_archives_hierarchy_controller(
  list_item_selector,
  sublist_item_selector,
  parent_class,
  trigger_class
) {
  jQuery(list_item_selector)
    .has(sublist_item_selector)
    .each(function () {
      jQuery(this).addClass(parent_class);
      jQuery(this).append("<span class='" + trigger_class + "'></span>");
    });
  jQuery(list_item_selector + ">" + sublist_item_selector).css(
    "display",
    "none"
  );
  jQuery(list_item_selector + ">.item-wrapper>" + sublist_item_selector).css(
    "display",
    "none"
  );
  jQuery(document).on(
    "click",
    list_item_selector + " ." + trigger_class,
    function () {
      var el = jQuery(this);
      var sublist = el.siblings(sublist_item_selector);
      var sublist_alt = el
        .siblings(".item-wrapper")
        .children(sublist_item_selector);
      if (!sublist.length && !sublist_alt.length) return;
      sublist = sublist.first();
      sublist_alt = sublist_alt.first();
      if (!el.hasClass("active")) {
        var currentParents = el.parents(".menu-item");
        el.parents()
          .siblings(".menu-item")
          .find("." + trigger_class)
          .removeClass("active");
        el.parents().siblings(".menu-item").find(".sub-menu").slideUp(300);
      }
      el.toggleClass("active");
      sublist.slideToggle(300);
      sublist_alt.slideToggle(300);
    }
  );
}

function fix_responsive_iframe() {
  jQuery(".video-embed > div").each(function () {
    jQuery(this).unwrap(".video-embed");
  });
}

function elements_slider_init() {
  jQuery(".elementor-element .owl-carousel").each(function () {
    let slider = jQuery(this),
      slider_options = slider.data("slider-options"),
      itemsMobile = 1,
      itemsTablet = 1,
      itemsDesktop = 1,
      dotsContainer = slider_options["dotsContainer"],
      dotsContainerMobile = "",
      navContainer = slider_options["navContainer"],
      navContainerMobile = "";

    slider_options["rtl"] = !!theme.rtl;
    if (slider_options["dotsContainerMobile"]) {
      dotsContainerMobile = slider_options["dotsContainerMobile"];
    } else {
      dotsContainerMobile = slider_options["dotsContainer"];
    }
    if (slider_options["navContainerMobile"]) {
      navContainerMobile = slider_options["navContainerMobile"];
    } else {
      navContainerMobile = slider_options["navContainer"];
    }
    if (!slider_options["navText"]) {
      slider_options["navText"] = ["", ""];
    }

    switch (slider_options["items"]) {
      case 2:
        itemsMobile = 1;
        itemsTablet = 2;
        itemsDesktop = 2;
        break;
      case 3:
        itemsMobile = 1;
        itemsTablet = 2;
        itemsDesktop = 3;
        break;
      case 4:
        itemsMobile = 1;
        itemsTablet = 2;
        itemsDesktop = 4;
        break;
      case 5:
        itemsMobile = 1;
        itemsTablet = 2;
        itemsDesktop = 5;
        break;
      case 6:
        itemsMobile = 1;
        itemsTablet = 3;
        itemsDesktop = 6;
        break;
      default:
        break;
    }

    slider_options["responsive"] = {
      0: {
        items: itemsMobile,
        dotsContainer: dotsContainerMobile,
        navContainer: navContainerMobile ? navContainerMobile : false,
      },
      576: {
        items: slider_options["items"] > 5 ? 2 : itemsTablet,
        dotsContainer: dotsContainerMobile,
      },
      768: {
        items: itemsTablet,
        dotsContainer: dotsContainerMobile,
      },
      992: {
        items: itemsDesktop,
        dotsContainer: dotsContainer,
      },
    };

    if (
      slider.hasClass("project-listing-wrapper") &&
      slider_options["items"] > 3
    ) {
      slider_options["responsive"][992] = {
        items: 3,
        dotsContainer: dotsContainer,
      };
      slider_options["responsive"][1280] = {
        items: itemsDesktop,
        dotsContainer: dotsContainer,
      };
    }
    slider.owlCarousel(slider_options);
  });
}

// Isotope init
function isotope_init() {
  if (jQuery(".isotope").length > 0) {
    jQuery(".isotope-trigger").isotope({
      itemSelector: ".isotope-item",
      gutter: 0,
      layoutMode: "masonry",
      masonry: {
        columnWidth: ".grid-sizer",
      },
    });
    jQuery(".gallery-filter-control-list").on(
      "click",
      ".gallery-filter-control-item",
      function () {
        var filterValue = jQuery(this).addClass("active").attr("data-filter");
        jQuery(this).siblings().removeClass("active");
        jQuery(this)
          .closest(".isotope-filter")
          .find(".isotope-trigger")
          .isotope({ filter: filterValue });
      }
    );
  }
}

function help_item_acardeon() {
  jQuery(".help-item").each(function () {
    jQuery(".help-item-title", this).on("click", function () {
      jQuery(this)
        .siblings(".help-item-content")
        .slideToggle(300)
        .parents(".help-item")
        .toggleClass("active");
    });
  });
}
help_item_acardeon();

function custom_video_play_button() {
  jQuery(".mejs-overlay-button").each(function () {
    jQuery(this).html(
      '<svg aria-hidden="true" class="progress" width="70" height="70" viewbox="0 0 70 70"><path class="progress__circle" d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z" /><path class="progress__path" d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z" pathLength="1" /></svg>'
    );
  });
}

function background_image_parallax(object, multiplier) {
  if (object.length > 0) {
    multiplier = typeof multiplier !== "undefined" ? multiplier : 0.5;
    multiplier = 1 - multiplier;
    var doc = jQuery(document);
    if (jQuery(window).width() >= 992) {
      var from_top = doc.scrollTop() - object.offset().top,
        bg_css = multiplier * from_top + "px";
      object.css({
        "background-position-y": bg_css,
      });
    } else {
      object.css({
        "background-position-y": "",
      });
    }
    jQuery(window).scroll(function () {
      if (jQuery(window).width() >= 992) {
        var from_top = doc.scrollTop() - object.offset().top,
          bg_css = multiplier * from_top + "px";
        object.css({
          "background-position-y": bg_css,
        });
      } else {
        object.css({
          "background-position-y": "",
        });
      }
    });
  }
}

// Init WPForms submit button

function initWPFormsSubmitButton() {
  jQuery(".wpforms-submit").html(
    jQuery(".wpforms-submit").html() +
      '<span class="icon-button-arrow left"></span><span class="icon-button-arrow right"></span><span class="button-inner"></span>'
  );
  jQuery(".wpforms-page-button").html(
    jQuery(".wpforms-page-button").html() +
      '<span class="icon-button-arrow left"></span><span class="icon-button-arrow right"></span><span class="button-inner"></span>'
  );
  jQuery(".mc4wp-form-fields button").html(
    jQuery(".mc4wp-form-fields button").html() +
      '<span class="icon-button-arrow left"></span><span class="icon-button-arrow right"></span><span class="button-inner"></span>'
  );
}

// Scroll To  Top
function scroll_to_top_init() {
  var scrollTop = jQuery(window).scrollTop();
  if (scrollTop > 600) {
    jQuery(".footer-scroll-top").addClass("show");
  } else {
    jQuery(".footer-scroll-top").removeClass("show");
  }
}

scroll_to_top_init();

function footer_scroll_top() {
  jQuery(".footer-scroll-top button", ".body-container").on(
    "click",
    function () {
      jQuery("html, body").animate(
        {
          scrollTop: 0,
        },
        500
      );
    }
  );
}

// ---------------------- //
// --- Document Ready --- //
// ---------------------- //
jQuery(document).ready(function () {
  // Parallax
  background_image_parallax(jQuery('[data-parallax="scroll"]'), 0.7);

  footer_scroll_top();

  initFloatPlaceholderInput();

  // Mobile Menu
  function mobile_menu() {
    jQuery(".mobile-header-menu-container .main-menu, .extra-menu")
      .find(".menu-item")
      .each(function (i, el) {
        if (
          jQuery(el).find(".sub-menu").length != 0 &&
          jQuery(el).find(".sub-menu-trigger").length == 0
        ) {
          jQuery(el).append('<span class="sub-menu-trigger"></span>');
        }
      });

    jQuery(".sub-menu-trigger").off();
    jQuery(".sub-menu-trigger").on("click", function () {
      if (jQuery(this).parent().hasClass("active")) {
        jQuery(this).prev().slideUp();
        jQuery(this).parent().removeClass("active");
      } else {
        var currentParents = jQuery(this).parents(".menu-item");
        jQuery(".sub-menu-trigger")
          .parent()
          .not(currentParents)
          .removeClass("active");
        jQuery(".sub-menu-trigger")
          .parent()
          .not(currentParents)
          .find(".sub-menu")
          .slideUp(300);

        jQuery(this).prev().slideDown();
        jQuery(this).parent().addClass("active");
      }
    });
  }
  mobile_menu();

  menu_text_animate();

  initWPFormsSubmitButton();

  jQuery(".dropdown-trigger .dropdown-trigger-item").on("click", function () {
    jQuery(this).addClass("active");
  });

  // Scroll to Anchor
  function scroll_to_anchor() {
    jQuery(".pwb-az-listing-header a").on("click", function () {
      var target = jQuery(this).attr("href");
      jQuery("body, html").animate(
        { scrollTop: jQuery(target).offset().top - 200 + "px" },
        600
      );
      return false;
    });
  }
  scroll_to_anchor();

  // Custom Video Play Button
  setTimeout(custom_video_play_button, 800);

  // Tilt
  function tilt_effect() {
    jQuery(".tilt-effect").tilt({
      maxTilt: 23,
      perspective: 2e3,
      easing: "cubic-bezier(.22,.61,.36,1)",
    });
  }

  // Tilt alter
  document.addEventListener("mousemove", parallax);
  function parallax(e) {
    var moving_value = -10;
    jQuery(".tilt-part img").each(function () {
      var x = (e.clientX * moving_value) / 250;
      var y = (e.clientY * moving_value) / 250;
      moving_value = moving_value + 4;
      jQuery(this)
        .css({
          transform: "translate(" + x + "px, " + y + "px)",
        })
        .attr("data-value", moving_value);
    });
  }

  tilt_effect();
  widget_list_hierarchy_init();
  setTimeout(fix_responsive_iframe, 800);
  setTimeout(elements_slider_init, 500);
  setTimeout(isotope_init, 500);
});

// --------------------- //
// --- Window Resize --- //
// --------------------- //
jQuery(window).on("resize", function () {
  sticky_menu_active();
  mobile_menu_open();
  background_image_parallax(jQuery('[data-parallax="scroll"]'), 0.7);
});

// --------------------- //
// --- Window Scroll --- //
// --------------------- //
jQuery(window).on("scroll", function () {
  scroll_to_top_init();
});

(function ($) {
  // Page Preloader
  var loader;
  $.fn.start_loader = start_loader;
  $.fn.stop_loader = stop_loader;

  $(document).ready(function () {
    page_loader_controller();
  });

  function page_loader_controller() {
    var page_loader, interval, timeLaps;
    page_loader = $(".page-loader");
    timeLaps = 0;
    interval = setInterval(function () {
      var page_loaded = check_if_page_loaded();
      timeLaps++;
      if (page_loaded || timeLaps == 12) {
        clearInterval(interval);
        page_loader.stop_loader();
      }
    }, 10);
  }

  function check_if_page_loaded() {
    var keys, key, i, r;
    if (window.modules_state == undefined) return false;
    r = true;
    keys = Object.keys(window.modules_state);
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      if (!window.modules_state[key]) {
        r = false;
        break;
      }
    }
    return r;
  }

  function start_loader() {
    var loader_container;
    loader = jQuery(this);
    if (!loader.length) return;
    loader_container = loader[0].parentNode;
    if (loader_container != null) {
      loader_container.style.opacity = 1;
      setTimeout(function () {
        loader_container.style.display = "block";
      }, 10);
    }
  }

  function stop_loader() {
    var loader_container;
    loader = jQuery(this);
    if (!loader.length) return;
    loader_container = loader[0].parentNode;
    if (loader_container != null) {
      setTimeout(function () {
        loader_container.style.opacity = 0;
        setTimeout(function () {
          loader_container.style.display = "none";
        }, 300);
      }, 300);
    }
  }

  // AJAX Pagination for Elementor Post Listing
  $(".elementor-widget").on("click", ".content-pagination a", function (e) {
    e.preventDefault();
    var paged = null;
    var id = $(this).parents(".elementor-widget").attr("data-id");
    if ($(this).hasClass("prev")) {
      paged = parseInt($(this).siblings(".current").text()) - 1;
    } else if ($(this).hasClass("next")) {
      paged = parseInt($(this).siblings(".current").text()) + 1;
    } else {
      paged = parseInt($(this).text());
    }
    var filter_term = $(
      ".filter-control-list .dot.active",
      $(this).parents(".archive-listing").siblings(".filter-control-wrapper")
    ).attr("data-value");
    var filter_taxonomy = $(
      ".filter-control-list",
      $(this).parents(".archive-listing").siblings(".filter-control-wrapper")
    ).attr("data-taxonomy");

    genre_get_posts(paged, id, filter_term, filter_taxonomy);
  });

  // AJAX Filter for Elementor Post Listing
  $(".elementor-widget").on(
    "click",
    ".filter-control-list .filter-control-item",
    function (e) {
      e.preventDefault();
      var paged = 1;
      var id = $(this).parents(".elementor-widget").attr("data-id");
      var filter_term = $(this).attr("data-value");
      var filter_taxonomy = $(this)
        .parents(".filter-control-list")
        .attr("data-taxonomy");
      if (filter_term === "all") {
        filter_term = null;
      }

      $(this)
        .addClass("active")
        .siblings(".filter-control-item")
        .removeClass("active");

      genre_get_posts(paged, id, filter_term, filter_taxonomy);
    }
  );

  // Main AJAX function
  function genre_get_posts(
    paged = 1,
    id = null,
    filter_term = null,
    filter_taxonomy = null
  ) {
    var ajax_url = ajax_params.ajax_url;
    var args = $(".archive-listing", ".elementor-element-" + id).attr(
      "data-ajax"
    );
    var widget = $(".archive-listing", ".elementor-element-" + id).attr(
      "data-widget"
    );
    var classes = $(
      ".archive-listing-wrapper",
      ".elementor-element-" + id
    ).attr("class");

    $.ajax({
      type: "POST",
      url: ajax_url,
      data: {
        action: "pagination",
        args: args,
        widget: widget,
        paged: paged,
        classes: classes,
        id: id,
        filter_term: filter_term,
        filter_taxonomy: filter_taxonomy,
      },
      beforeSend: function () {
        var height = $(
          ".archive-listing",
          ".elementor-element-" + id
        ).outerHeight();
        $(".archive-listing", ".elementor-element-" + id)
          .height(height)
          .addClass("loading");
      },
      success: function (data) {
        $(".archive-listing", ".elementor-element-" + id).html(data);
        if ($(window.wp.mediaelement).length > 0) {
          $(window.wp.mediaelement.initialize);
        }
        setTimeout(function () {
          $(".archive-listing", ".elementor-element-" + id)
            .removeAttr("style")
            .removeClass("loading");
        }, 500);
        setTimeout(elements_slider_init, 300);
        setTimeout(fix_responsive_iframe, 600);
        setTimeout(custom_video_play_button, 800);
        setTimeout(isotope_init, 500);
        jQuery("body").trigger("genre_get_posts_success", [classes, id]);
      },
      error: function () {
        $(".archive-listing", ".elementor-element-" + id).html(
          '<p class="error">AJAX ERROR</p>'
        );
      },
    });
  }
})(jQuery);
