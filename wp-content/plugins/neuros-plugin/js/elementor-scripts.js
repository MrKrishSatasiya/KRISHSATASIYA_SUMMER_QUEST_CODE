// jQuery(window).on('elementor/frontend/init', function () {
// 	elementorFrontend.hooks.addAction( 'frontend/element_ready/section', function( $scope ) {
// 		if( !jQuery('body').hasClass('elementor-editor-active') ) {
// 	        if(!$scope.children('.elementor-container').children('.elementor-row').length) {
// 	            $scope.children('.elementor-container').wrapInner('<div class="elementor-row"></div>');
// 	        }
// 	    } else {
// 	    	if(!$scope.children('.elementor-container').children('.elementor-row').length) {
// 	            $scope.children('.elementor-container').wrapInner('<div class="elementor-row ui-sortable"></div>');
// 	        }
// 	    }
//     });
//     elementorFrontend.hooks.addAction('frontend/element_ready/icon.default', function ($scope) {
//         if($scope.hasClass('neuros-icon-decoration-on')) {
//             $scope.find('.elementor-icon-wrapper').wrapInner('<div class="elementor-icon-inner"></div>');
//         }
//     });
// 	if(typeof elementor !== 'undefined') {
// 		elementor.hooks.addAction('panel/open_editor/column', function( panel, model, view ) {
// 		    var column = view.$el;
// 		    if(column.parent().hasClass('elementor-container')) {
// 		        column.siblings('.elementor-row').children().unwrap();
// 		        column.parent('.elementor-container').wrapInner('<div class="elementor-row ui-sortable"></div>');
// 		    }
// 		});
// 	}
// });

// Flowmap deformation effect
function flowmap_deformation() {
  jQuery(".flowmap-deformation-wrapper").each(function () {
    let box = jQuery(this);

    setTimeout(function () {
      box.addClass("active");
    }, 300);

    const imgSize = [box.data("bg-width"), box.data("bg-height")];

    const vertex = `
                    attribute vec2 uv;
                    attribute vec2 position;
                    varying vec2 vUv;
                    void main() {
                            vUv = uv;
                            gl_Position = vec4(position, 0, 1);
                    }
            `;
    const fragment = `
                    precision highp float;
                    precision highp int;
                    uniform sampler2D tWater;
                    uniform sampler2D tFlow;
                    uniform float uTime;
                    varying vec2 vUv;
                    uniform vec4 res;

                    void main() {

                            // R and G values are velocity in the x and y direction
                            // B value is the velocity length
                            vec3 flow = texture2D(tFlow, vUv).rgb;

                            vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
                            vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
                            myUV -= flow.xy * (0.15 * 0.7);

                            vec3 tex = texture2D(tWater, myUV).rgb;

                            gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.0);
                    }
            `;
    {
      const renderer = new ogl.Renderer({ dpr: 2 });
      const gl = renderer.gl;
      box.append(gl.canvas);

      // Variable inputs to control flowmap
      let aspect = 1;
      const mouse = new ogl.Vec2(-1);
      const velocity = new ogl.Vec2();
      function resize() {
        let a1, a2;
        var imageAspect = imgSize[1] / imgSize[0];
        if (box.outerHeight() / box.outerWidth() < imageAspect) {
          a1 = 1;
          a2 = box.outerHeight() / box.outerWidth() / imageAspect;
        } else {
          a1 = (box.outerWidth() / box.outerHeight()) * imageAspect;
          a2 = 1;
        }
        mesh.program.uniforms.res.value = new ogl.Vec4(
          box.outerWidth(),
          box.outerHeight(),
          a1,
          a2
        );

        renderer.setSize(box.outerWidth(), box.outerHeight());
        aspect = box.outerWidth() / box.outerHeight();
      }
      const flowmap = new ogl.Flowmap(gl, {
        falloff: 0.6,
      });
      // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
      const geometry = new ogl.Geometry(gl, {
        position: {
          size: 2,
          data: new Float32Array([-1, -1, 3, -1, -1, 3]),
        },
        uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
      });
      const texture = new ogl.Texture(gl, {
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
      });
      const img = new Image();
      img.onload = () => (texture.image = img);
      img.crossOrigin = "Anonymous";
      img.src = box.data("bg");

      let a1, a2;
      var imageAspect = imgSize[1] / imgSize[0]; //0.5573
      if (box.outerHeight() / box.outerWidth() < imageAspect) {
        // 0.4146 < 0.5573
        a1 = 1;
        a2 = box.outerHeight() / box.outerWidth() / imageAspect; // 0.7439
      } else {
        a1 = (box.outerWidth() / box.outerHeight()) * imageAspect;
        a2 = 1;
      }

      const program = new ogl.Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          tWater: { value: texture },
          res: {
            value: new ogl.Vec4(box.outerWidth(), box.outerHeight(), a1, a2),
          },
          img: { value: new ogl.Vec2(imgSize[0], imgSize[1]) },
          // Note that the uniform is applied without using an object and value property
          // This is because the class alternates this texture between two render targets
          // and updates the value property after each render.
          tFlow: flowmap.uniform,
        },
      });
      const mesh = new ogl.Mesh(gl, { geometry, program });

      window.addEventListener("resize", resize, false);
      resize();

      // Create handlers to get mouse position and velocity
      const isTouchCapable = "ontouchstart" in window;
      const section = box.closest("section")[0];
      if (isTouchCapable) {
        section.addEventListener("touchstart", updateMouse, false);
        section.addEventListener("touchmove", updateMouse, { passive: false });
      } else {
        section.addEventListener("mousemove", updateMouse, false);
      }
      let lastTime;
      const lastMouse = new ogl.Vec2();
      function updateMouse(e) {
        // e.preventDefault();
        if (e.changedTouches && e.changedTouches.length) {
          e.x = e.changedTouches[0].pageX;
          e.y = e.changedTouches[0].pageY;
        }
        if (e.x === undefined) {
          e.x = e.pageX;
          e.y = e.pageY;
        }
        // Get mouse value in 0 to 1 range, with y flipped
        mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);
        // Calculate velocity
        if (!lastTime) {
          // First frame
          lastTime = performance.now();
          lastMouse.set(e.x, e.y);
        }

        const deltaX = e.x - lastMouse.x;
        const deltaY = e.y - lastMouse.y;

        lastMouse.set(e.x, e.y);

        let time = performance.now();

        // Avoid dividing by 0
        let delta = Math.max(10.4, time - lastTime);
        lastTime = time;
        velocity.x = deltaX / delta;
        velocity.y = deltaY / delta;
        // Flag update to prevent hanging velocity values when not moving
        velocity.needsUpdate = true;
      }
      requestAnimationFrame(update);
      function update(t) {
        requestAnimationFrame(update);
        // Reset velocity when mouse not moving
        if (!velocity.needsUpdate) {
          mouse.set(-1);
          velocity.set(0);
        }
        velocity.needsUpdate = false;
        // Update flowmap inputs
        flowmap.aspect = aspect;
        flowmap.mouse.copy(mouse);
        // Ease velocity input, slower when fading out
        flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
        flowmap.update();
        program.uniforms.uTime.value = t * 0.01;
        renderer.render({ scene: mesh });
      }
    }
  });
}

jQuery(window).on("elementor/frontend/init", function () {
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/icon.default",
    function ($scope) {
      if ($scope.hasClass("neuros-icon-decoration-on")) {
        $scope
          .find(".elementor-icon-wrapper")
          .wrapInner('<div class="elementor-icon-inner"></div>');
      }
      if (
        $scope
          .find(".elementor-icon")
          .hasClass("elementor-animation-slide-horizontal")
      ) {
        $scope
          .find(".elementor-icon i, .elementor-icon svg")
          .clone()
          .appendTo($scope.find(".elementor-icon"));
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/global",
    function ($scope) {
      if (jQuery("body").hasClass("elementor-editor-active")) {
        if (
          $scope.hasClass("elementor-section") &&
          !$scope.children(".elementor-container").children(".elementor-row")
            .length
        ) {
          $scope
            .children(".elementor-container")
            .wrapInner('<div class="elementor-row ui-sortable"></div>');
        } else if (
          $scope.hasClass("elementor-column") &&
          !$scope.parent(".elementor-row").length
        ) {
          $scope.siblings(".elementor-row").children().unwrap();
          $scope
            .parent(".elementor-container")
            .wrapInner('<div class="elementor-row ui-sortable"></div>');
        }
      }
    }
  );
  elementorFrontend.hooks.addAction(
    "frontend/element_ready/section",
    function ($scope) {
      if (!jQuery("body").hasClass("elementor-editor-active")) {
        if (
          !$scope.children(".elementor-container").children(".elementor-row")
            .length
        ) {
          $scope
            .children(".elementor-container")
            .wrapInner('<div class="elementor-row"></div>');
          if ($scope.data("parallax") == "scroll") {
            background_image_parallax($scope, 0.7);
          }
        } else {
          if ($scope.data("parallax") == "scroll") {
            background_image_parallax($scope, 0.7);
          }
        }
      }
      if (
        $scope.data("flowmap") === "on" &&
        $scope.data("flowmap-url") !== ""
      ) {
        $scope.prepend('<div class="flowmap-deformation-wrapper"></div>');
        $scope.find(".flowmap-deformation-wrapper").attr({
          "data-bg": $scope.data("flowmap-url"),
          "data-bg-width": $scope.data("flowmap-width"),
          "data-bg-height": $scope.data("flowmap-height"),
        });
        $scope
          .find(".flowmap-deformation-wrapper")
          .css("background-image", "url(" + $scope.data("flowmap-url") + ")");
        // Flowmap Effect
        $scope.one("mouseover", flowmap_deformation);
      }
    }
  );
});
