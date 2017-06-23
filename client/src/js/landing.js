/* eslint-disable */
import $ from 'jquery'
import { scroll, scrollTop } from 'jquery.nicescroll'
import { animate } from 'jquery.easing'

$.fn.transition = require('semantic-ui-transition')
$.fn.sidebar = require('semantic-ui-sidebar')
$.fn.visibility = require('semantic-ui-visibility')

$(document).ready(function() {

  // fix menu when passed
  $('.masthead .ui.text.container')
    .visibility({
      once: false,
      onBottomPassed: function() {
        $('.fixed.menu').transition('fade in');
      },
      onBottomPassedReverse: function() {
        $('.fixed.menu').transition('fade out');
      }
    })
  ;

  // create sidebar and attach to menu open
  $('.ui.sidebar')
    .sidebar('attach events', '.toc.item')
  ;  

  $('.back-to-top').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 1000);
    return false;
  });
});

/* ==============================================
1.Scroll to top
=============================================== */
$(window).scroll(function(){
  if ($(this).scrollTop() > 100) {
    $('.back-to-top').fadeIn();
  } else {
    $('.back-to-top').fadeOut();
  }
});

/* ==============================================
2.Smooth Scroll To Anchor
=============================================== */
//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
  $('.pointing.menu a').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 50
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });
});