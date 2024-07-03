"use strict";

function animateHeading($scope) {
  if (
    $scope.data("settings") &&
    $scope.data("settings")._animation &&
    $scope.data("settings")._animation == "neuros_heading_animation"
  ) {
    $scope.find(".neuros-heading-content").html(
      $scope
        .find(".neuros-heading-content")
        .html()
        .replace(
          /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
          '$1<span class="word">$2</span>'
        )
    );
    // $scope.find('.neuros-heading-content').contents().each(function() {
    //     if(this.nodeType === 3) {
    //         jQuery(this).wrap('<span></span>');
    //     }
    // });
    $scope
      .find(".neuros-heading-content .word")
      .contents()
      .each(function () {
        if (this.nodeType === 3) {
          jQuery(this)
            .parent()
            .html(
              jQuery(this)
                .text()
                .replace(/\S/g, '<span class="letter">$&</span>')
            );
        }
      });
    $scope.find(".neuros-heading-content .letter").each(function (index) {
      jQuery(this).css("transition-delay", index / 50 + "s");
    });
  }
}

function initModernProjects($el) {
  $el
    .find(".project-modern-listing .project-item-wrapper")
    .first()
    .addClass("active");
  $el
    .find(".project-modern-listing .project-item-modern-header")
    .on("click", function () {
      var $projectItem = jQuery(this).closest(".project-item-wrapper");
      $projectItem.addClass("active");
      $projectItem.find(".project-item-modern-content").slideDown(400);
      $projectItem.siblings().removeClass("active");
      $projectItem.siblings().find(".project-item-modern-content").slideUp(400);
    });
}

function playProjectsSliderAudio($el) {
  $el
    .find(".project-listing-wrapper.project-slider-listing.content-type-audio")
    .on("click", ".play-audio", function () {
      jQuery(this)
        .closest(".owl-item")
        .siblings()
        .find(".project-audio-wrapper audio")
        .each(function () {
          jQuery(this)[0].pause();
          jQuery(this)[0].currentTime = 0;
          jQuery(this).siblings(".play-audio").removeClass("active");
        });
      var audioElement = jQuery(this).siblings("audio")[0];
      if (audioElement.paused) {
        jQuery(this).addClass("active");
        audioElement.play();
      } else {
        audioElement.pause();
        audioElement.currentTime = 0;
        jQuery(this).removeClass("active");
      }
    });
}

function playListingAudio($el) {
  $el.find(".neuros-audio-listing").on("click", ".audio-item", function () {
    jQuery(this)
      .closest(".audio-item-wrapper")
      .siblings()
      .find(".audio-item")
      .each(function () {
        jQuery(this).removeClass("active");
        jQuery(this).find("audio")[0].pause();
        jQuery(this).find("audio")[0].currentTime = 0;
      });
    var audioElement = jQuery(this).find("audio")[0];
    if (audioElement.paused) {
      jQuery(this).addClass("active");
      audioElement.play();
    } else {
      audioElement.pause();
      audioElement.currentTime = 0;
      jQuery(this).removeClass("active");
    }
  });
}

function handleProjectsExcerptHeight() {
  jQuery(
    ".project-listing-wrapper.project-slider-listing:not(.content-type-audio) .project-item"
  ).each(function () {
    const item = jQuery(this);
    const excerpt = jQuery(this).find(".post-excerpt-wrapper");
    excerpt.hide();
    item.on("mouseenter", function () {
      excerpt.delay(300).slideDown(300);
    });
    item.on("mouseleave", function () {
      excerpt.slideUp(300);
    });
  });
}

jQuery(window).on("elementor/frontend/init", function () {
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_audio_listing.default",
    function ($scope) {
      playListingAudio($scope);
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_blog_listing.default",
    function () {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        setTimeout(elements_slider_init, 300);
        setTimeout(fix_responsive_iframe, 600);
        setTimeout(custom_video_play_button, 800);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_gallery.default",
    function () {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        setTimeout(isotope_init, 2500);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_projects_listing.default",
    function ($scope) {
      animateHeading($scope);
      if (jQuery("body").hasClass("elementor-editor-active")) {
        setTimeout(elements_slider_init, 500);
        setTimeout(isotope_init, 2500);
      }
      setTimeout(handleProjectsExcerptHeight, 500);
      if ($scope.find(".project-modern-listing").length > 0) {
        var scopeID = $scope.attr("data-id");
        initModernProjects($scope);
        jQuery("body").on("genre_get_posts_success", function (e, classes, id) {
          if (
            classes.indexOf("project-modern-listing") !== -1 &&
            id === scopeID
          ) {
            initModernProjects($scope);
          }
        });
      }
      if ($scope.find(".content-type-audio").length > 0) {
        playProjectsSliderAudio($scope);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_testimonial_carousel.default",
    function () {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        setTimeout(elements_slider_init, 500);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_image_carousel.default",
    function ($scope) {
      animateHeading($scope);
      if (jQuery("body").hasClass("elementor-editor-active")) {
        setTimeout(elements_slider_init, 500);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_content_slider.default",
    function () {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        setTimeout(elements_slider_init, 500);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_wpforms.default",
    function () {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        initFloatPlaceholderInput();
        initWPFormsSubmitButton();
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_mailchimp.default",
    function () {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        initFloatPlaceholderInput();
        initWPFormsSubmitButton();
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/section.default",
    function () {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        background_image_parallax(jQuery('[data-parallax="scroll"]'), 0.7);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_heading.default",
    function ($scope) {
      animateHeading($scope);
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/neuros_step_carousel.default",
    function ($scope) {
      animateHeading($scope);
      if (jQuery("body").hasClass("elementor-editor-active")) {
        setTimeout(elements_slider_init, 500);
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/image.default",
    function ($scope) {
      if (jQuery(window).width() >= 1025) {
        const cursor = jQuery(".hovered-text", $scope);

        function showCustomCursor(event) {
          cursor.css("left", event.clientX).css("top", event.clientY);
        }
        if (cursor.length > 0) {
          $scope.mousemove(showCustomCursor);

          $scope.mouseleave(function (e) {
            if (!jQuery("body").hasClass("elementor-editor-active")) {
              jQuery("a", $scope).css({ cursor: "auto" });
              $scope.css({ cursor: "auto" });
              cursor.removeClass("active");
            }
          });

          $scope.mouseenter(function (e) {
            if (!jQuery("body").hasClass("elementor-editor-active")) {
              jQuery("a", $scope).css({ cursor: "none" });
              $scope.css({ cursor: "none" });
              cursor.addClass("active");
            }
          });
        }
      }
    }
  );
});
