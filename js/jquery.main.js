(function($){
	"use strict";

	// page init
	$(function(){
		initBurger();
		initProgressBar();
		initAnimate();
		initFilter();
		initSmoothScroll();
		initCarousel();
		initCustomScroll();
		initGoogleMap();
	});

	$(window).on("scroll", function(){
		var position = $(window).scrollTop(),
			header = $("#header");

		if (position > 100) {
			header.addClass('fixed');
			$('#wrapper').removeClass('show-menu');
		} else {
			header.removeClass('fixed');
		}
	});

	// Carousel
	function initCarousel() {
		$('.carousel').slick({
			infinite: true,
			speed: 2000,
			fade: true,
			autoplay: true,
			arrows: false,
			centerMode: true,
			cssEase: 'linear'
		});

		$('.testimonials').slick({
			dots: true,
			infinite: true,
			arrows: false,
			speed: 500,
			fade: true,
			cssEase: 'linear'
		});
	}

	// Smooth Page Scrolling
	function initSmoothScroll() {
		var dropDown = $('.drop-down'),
			dropdownLinks = dropDown.find('a[href^="#"]:not([href="#"])');

		dropDown.on('click', function (e) {
			var el = $(e.target);

			if (el.is(dropdownLinks)){
				var target = $(el[0].hash);
				
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top
					}, 500);
					return false;
				}
			}
		});

		$(window).on("scroll", function(){
			var scrollPos = $(document).scrollTop();

			dropdownLinks.each(function () {
				var currLink = $(this),
					refElement = $(currLink.attr('href'));

				if (refElement.length > 0){
					if ((refElement.offset().top - 1) <= scrollPos && (refElement.offset().top - 1) + refElement.height() > scrollPos) {
						currLink.addClass('active');
					} else {
						currLink.removeClass('active');
					}
				}
			});
		}).trigger("scroll");
	}

	// initialize burger menu
	function initBurger() {
		var holder = $('#wrapper'),
			customClass = 'show-menu';

		$('.nav-opener').on('click', function (e) {
			e.preventDefault();
			holder.toggleClass(customClass);
		});

		$(document).on('mouseup', function (e) {
			var container = $(".main-navigation");
			if (container.has(e.target).length === 0){
				holder.removeClass(customClass);
			}
		});
	}

	// Progress Bar
	function initProgressBar() {
		$('.progress-area').each(function() {
			var area = $(this),
				block = area.closest('[data-animation]');

			var value = (area.data('to') / 100);

			var bar = new ProgressBar.Line(this, {
				easing: 'linear',
				duration: 1500,
				color: '#eaa407',
				text: {
					value: '0'
				}
			});

			block.on('isVisible', function(){
				bar.animate(value, {
					step: function() {
						bar.setText((bar.value() * 100).toFixed(0) + '%');
					}
				});
			});
		});
	}

	// init animation
	function initAnimate() {
		var win = $(window),
			activeClass = 'animation';

		$('[data-animation]').each(function () {
			var block = $(this);
			var refresh = function() {
				var isVisible = win.scrollTop() + win.height() >= block.offset().top && win.scrollTop() <= block.offset().top + block.outerHeight();
				if (isVisible) {
					block.addClass(activeClass).trigger('isVisible');
					win.off('load scroll resize', refresh);
				} else {
					block.removeClass(activeClass).trigger('notVisible');
				}
			};
			win.on('load scroll resize', refresh);
		});
	}

	// init Portfolio
	function initFilter(){
		var shuffleme = (function($) {
			var $grid = $('.filter-grid'),
				$filterOptions = $('.filters-buttons'),

				init = function() {
					setTimeout(function() {
						setupFilters();
					}, 100);

					$grid.shuffle({
						itemSelector: '[class="box"]'
					});
				},
				// Set up button clicks
				setupFilters = function() {
					var $btns = $filterOptions.children();
					$btns.on('click', function(e) {
						e.preventDefault();
						var $this = $(this),
							isActive = $this.hasClass('is-checked'),
							group = isActive ? 'all' : $this.data('group');

						if (!isActive) {
							$('.filters-buttons .btn').removeClass('is-checked');
						}
						$this.addClass('is-checked');
						$grid.shuffle( 'shuffle', group );
					});
					$btns = null;
				};
			return {
				init: init
			};
		}( $ ));

		$(document).ready(function(){
			shuffleme.init();
		});
	}

	function isOnScreen(item) {
		var $window, windowTop, windowBottom, $item, itemTop, itemBottom;
		$window = $(window);
		windowTop = $window.scrollTop();
		windowBottom = windowTop + $window.height();

		$item = $(item);
		itemTop = $item.offset().top;
		itemBottom = itemTop + $item.height();

		return !((itemTop < windowTop && itemBottom < windowTop) || (itemTop > windowBottom && itemBottom > windowBottom));
	}

	// initialize custom scroll
	function initCustomScroll() {
		$('.scroll-holder').mCustomScrollbar();
	}

	
})(jQuery);