/* Third party libraries */
import $ from 'jquery'

$.animate = require('jquery.easing')

$.fn.transition = require('semantic-ui-transition')
$.fn.sidebar = require('semantic-ui-sidebar')
$.fn.visibility = require('semantic-ui-visibility')

$(document).ready(function()  {

  // fix menu when passed
  $('.masthead .ui.text.container')
    .visibility({
      once: false,
      onBottomPassed: function()  {
        $('.fixed.menu').transition('fade in')
      },
      onBottomPassedReverse: function()  {
        $('.fixed.menu').transition('fade out')
      }
    })
  ;

  // create sidebar and attach to menu open
  //$('.ui.sidebar').sidebar('attach events', '.toc.item')  

  //$('.ui.sidebar').sidebar({ context: $('#app') }).sidebar('setting', 'transition', 'overlay')

  //jQuery for page scrolling feature - requires jQuery Easing plugin
  $('.pointing.menu .left.menu a').bind('click', function() {
    var $anchor = $(this)
    $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 50
    }, 1500, 'easeInOutExpo')
    event.preventDefault()
  })

  $('.back-to-top').click(function() {
    $("html, body").animate({ scrollTop: 0 }, 1000)
    return false
  })
})

/* ==============================================
1.Scroll to top
=============================================== */
$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
    $('.back-to-top').fadeIn()
  } else {
    $('.back-to-top').fadeOut()
  }
})
