var mb =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** Require CSS files **/
__webpack_require__(1);

var app = function () {

    var init = function init() {

        console.log('App initialized');
        app.scroller = __webpack_require__(2);
        app.player = __webpack_require__(3);
        app.gallery = __webpack_require__(4);
    };

    return {
        init: init
    };
}();

module.exports = app;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scroller = function () {
        function Scroller(element, scrollBar) {
                var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                _classCallCheck(this, Scroller);

                this.config = config;

                if (!element || !element instanceof HTMLElement) return;
                if (scrollBar && !scrollBar instanceof HTMLElement) return;

                this.scrollBar = scrollBar;
                this.scrollContent = element;

                this.prepareScrollBar();

                element.addEventListener('mousewheel', this.mouseWheel.bind(this));
        }

        _createClass(Scroller, [{
                key: 'prepareScrollBar',
                value: function prepareScrollBar() {

                        var bar = this.scrollBar;

                        bar.addEventListener('mousedown', this.scrollBarClicked.bind(this));

                        this.scrollBar = {
                                wrapper: bar,
                                rail: bar.querySelector('.scroll-bar__rail'),
                                slider: bar.querySelector('.scroll-bar__slider')
                        };
                }
        }, {
                key: 'mouseWheel',
                value: function mouseWheel(event) {

                        this.fixBody();

                        this.scrollBar.slider.classList.add('scroll-bar__slider--scrolling');

                        this.scrollBy(event.deltaY);

                        if (this.scrollTimer) clearTimeout(this.scrollTimer);

                        this.scrollTimer = setTimeout(this.scrollFinished.bind(this), 50);
                }
        }, {
                key: 'updateHeight',
                value: function updateHeight() {

                        this.contentScrollHeight = this.scrollContent.scrollHeight;
                        this.contentHeight = this.scrollContent.clientHeight;
                        this.barHeight = this.scrollBar.rail.clientHeight;
                        this.sliderHeight = Math.round(this.barHeight * this.contentHeight / this.contentScrollHeight);

                        this.scrollBar.slider.style.height = this.sliderHeight + 'px';
                }
        }, {
                key: 'scrollFinished',
                value: function scrollFinished() {

                        this.scrollBar.slider.classList.remove('scroll-bar__slider--scrolling');
                        this.unfixBody();
                }
        }, {
                key: 'scrollBarClicked',
                value: function scrollBarClicked(event) {

                        var coordsOnWrapper = Scroller.getClickCoords(event, this.scrollBar.wrapper),
                            coordsOnSlider = Scroller.getClickCoords(event, this.scrollBar.slider);

                        this.barClickOffset = coordsOnSlider.y;

                        var percents = (coordsOnWrapper.y - this.barClickOffset) / this.barHeight;

                        this.scrollTo(percents);

                        this.scrollBar.slider.classList.add('scroll-bar__slider--scrolling');

                        this.scrollDragHandler = this.scrollBarDragged.bind(this);
                        this.barReleasedHandler = this.scrollBarReleased.bind(this);

                        document.addEventListener('mousemove', this.scrollDragHandler);

                        document.addEventListener('mouseup', this.barReleasedHandler);
                }
        }, {
                key: 'scrollBarDragged',
                value: function scrollBarDragged(event) {

                        var coords = Scroller.getClickCoords(event, this.scrollBar.wrapper);

                        var percents = (coords.y - this.barClickOffset) / this.barHeight;

                        this.scrollTo(percents);
                }
        }, {
                key: 'scrollBarReleased',
                value: function scrollBarReleased(event) {

                        var coords = Scroller.getClickCoords(event, this.scrollBar.wrapper);

                        var percents = (coords.y - this.barClickOffset) / this.barHeight;

                        this.scrollTo(percents);
                        this.scrollBar.slider.classList.remove('scroll-bar__slider--scrolling');

                        document.removeEventListener('mousemove', this.scrollDragHandler);
                        document.removeEventListener('mouseup', this.barReleasedHandler);
                }
        }, {
                key: 'scrollTo',
                value: function scrollTo(percents) {

                        if (percents > (this.barHeight - this.sliderHeight) / this.barHeight || percents < 0) return;

                        this.scrollBar.slider.style.top = percents * this.barHeight + 'px';
                        this.scrollContent.scrollTop = percents * this.contentScrollHeight;
                }
        }, {
                key: 'scrollBy',
                value: function scrollBy(px) {

                        this.scrollContent.scrollTop += px;

                        var sliderPosition = Math.round(this.barHeight * this.scrollContent.scrollTop / this.contentScrollHeight);

                        this.scrollBar.slider.style.top = sliderPosition + 'px';

                        if ((this.scrollContent.scrollTop === 0 || this.scrollContent.scrollTop === this.contentScrollHeight - this.contentHeight) && !this.config.scrollLock) {

                                this.scrollBar.slider.classList.remove('scroll-bar__slider--scrolling');
                                this.unfixBody();
                        }
                }
        }, {
                key: 'fixBody',
                value: function fixBody() {

                        this.documentScrollHandler = function (event) {

                                event.preventDefault();
                        };

                        window.addEventListener('DOMMouseScroll', this.documentScrollHandler);
                        window.onwheel = this.documentScrollHandler;
                }
        }, {
                key: 'unfixBody',
                value: function unfixBody() {

                        window.removeEventListener('DOMMouseScroll', this.documentScrollHandler);
                        window.onwheel = null;
                }
        }], [{
                key: 'getClickCoords',
                value: function getClickCoords(event, elem) {

                        var elemOffset = { x: 0, y: 0 };

                        while (elem.offsetParent) {

                                elemOffset.x += elem.offsetLeft;
                                elemOffset.y += elem.offsetTop;

                                elem = elem.offsetParent;
                        }

                        return {
                                x: event.clientX - elemOffset.x + document.body.scrollLeft,
                                y: event.clientY - elemOffset.y + document.body.scrollTop
                        };
                }
        }]);

        return Scroller;
}();

module.exports = Scroller;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
        function Player(config) {
                _classCallCheck(this, Player);

                this.processConfig(config);
                this.prepareAudio();
                this.prepareConrtols();
        }

        _createClass(Player, [{
                key: 'processConfig',
                value: function processConfig(config) {

                        this.src = config.src;

                        var classes = {
                                playButton: {
                                        playing: null
                                },
                                volumeButton: null
                        };

                        var controls = {
                                playButton: null,
                                volume: {
                                        button: null,
                                        bar: null,
                                        indicator: null
                                },
                                progress: {
                                        bar: null,
                                        indicator: null,
                                        currentTime: null,
                                        duration: null
                                }
                        };

                        if (config.controls) {

                                if (config.controls.playButton) {

                                        controls.playButton = config.controls.playButton.element;
                                        classes.playButton.playing = config.controls.playButton.playingClass;
                                }

                                if (config.controls.progress) {

                                        controls.progress.bar = config.controls.progress.bar;
                                        controls.progress.indicator = config.controls.progress.indicator;
                                        controls.progress.currentTime = config.controls.progress.currentTime;
                                        controls.progress.duration = config.controls.progress.duration;
                                }

                                if (config.controls.volume) {

                                        if (config.controls.volume.button) {

                                                controls.volume.button = config.controls.volume.button.element;
                                                classes.volumeButton = config.controls.volume.button.classes;
                                        }

                                        if (config.controls.volume.bar && config.controls.volume.indicator) {

                                                controls.volume.bar = config.controls.volume.bar;
                                                controls.volume.indicator = config.controls.volume.indicator;
                                        }
                                }
                        }

                        this.classes = classes;
                        this.controls = controls;
                }
        }, {
                key: 'prepareConrtols',
                value: function prepareConrtols() {

                        var controls = this.controls;

                        if (controls.playButton) controls.playButton.addEventListener('click', this.togglePlayState.bind(this));

                        if (controls.volume.button) controls.volume.button.addEventListener('click', this.toggleMuteState.bind(this));

                        this.updateBars();

                        if (controls.volume.bar && controls.volume.indicator) {

                                controls.volume.bar.addEventListener('click', this.volumeBarClicked.bind(this));
                        }

                        if (controls.progress.bar && controls.progress.indicator) {

                                controls.progress.bar.addEventListener('click', this.progressBarClicked.bind(this));
                        }

                        if (controls.progress.currentTime) controls.progress.currentTime.textContent = '00:00';
                        if (controls.progress.duration) controls.progress.duration.textContent = '00:00';

                        window.addEventListener('resize', this.updateBars.bind(this));
                }
        }, {
                key: 'prepareAudio',
                value: function prepareAudio() {

                        var self = this;

                        var audio = new Audio();

                        audio.src = self.src;
                        audio.volume = 1;
                        audio.addEventListener('timeupdate', this.timeUpdated.bind(this));

                        if (self.controls.progress.duration) {

                                audio.addEventListener('durationchange', function () {

                                        self.controls.progress.duration.textContent = self.formatedDuration;
                                });
                        }

                        this.audio = audio;
                }
        }, {
                key: 'play',
                value: function play() {

                        if (!this.audio) return;

                        if (this.classes.playButton.playing) this.controls.playButton.classList.add(this.classes.playButton.playing);

                        this.audio.play();
                }
        }, {
                key: 'pause',
                value: function pause() {

                        if (!this.audio) return;

                        if (this.classes.playButton.playing) this.controls.playButton.classList.remove(this.classes.playButton.playing);

                        this.audio.pause();
                }
        }, {
                key: 'mute',
                value: function mute() {

                        this.previousVolume = this.audio.volume;
                        this.muted = true;

                        this.setVolume(0);
                }
        }, {
                key: 'unmute',
                value: function unmute() {

                        var previousVolume = this.previousVolume || 1;

                        this.muted = false;

                        this.setVolume(previousVolume);
                }
        }, {
                key: 'setVolume',
                value: function setVolume(percent) {

                        var value = Math.round(percent * 10);

                        if (percent) {

                                this.muted = false;
                                this.previousVolume = percent;
                        }

                        if (this.controls.volume.button) {

                                while (value < 10 && !this.classes.volumeButton[value]) {

                                        value++;
                                }

                                var cls = this.classes.volumeButton[value];

                                for (var i in this.classes.volumeButton) {

                                        this.controls.volume.button.classList.remove(this.classes.volumeButton[i]);
                                }

                                if (percent !== 1 && cls) {

                                        this.controls.volume.button.classList.add(cls);
                                }
                        }

                        this.audio.volume = percent;

                        if (this.controls.volume.bar && this.controls.volume.indicator) {

                                this.controls.volume.indicator.style.width = percent * this.volumeBarWidth + 'px';
                        }
                }
        }, {
                key: 'togglePlayState',
                value: function togglePlayState() {

                        if (!this.audio) return;

                        if (this.audio.paused) {

                                this.play();
                        } else {

                                this.pause();
                        }
                }
        }, {
                key: 'toggleMuteState',
                value: function toggleMuteState() {

                        if (!this.audio) return;

                        if (this.muted) {

                                this.unmute();
                        } else {

                                this.mute();
                        }
                }
        }, {
                key: 'updateBars',
                value: function updateBars() {

                        var volume = this.controls.volume,
                            progress = this.controls.progress;

                        if (volume.bar && volume.indicator) {

                                this.volumeBarWidth = volume.bar.clientWidth;

                                volume.indicator.style.width = this.audio.volume * this.volumeBarWidth + 'px';
                        }

                        if (progress.bar && progress.indicator) {

                                this.progressBarWidth = progress.bar.clientWidth;

                                progress.indicator.style.width = this.currentTime / this.duration * this.progressBarWidth + 'px';
                        }
                }
        }, {
                key: 'timeUpdated',
                value: function timeUpdated() {

                        if (this.controls.progress.currentTime) {

                                this.controls.progress.currentTime.textContent = this.formatedTime;
                        }

                        if (!this.controls.progress.bar || !this.controls.progress.indicator) return;

                        var time = this.currentTime,
                            indicator = this.controls.progress.indicator;

                        indicator.style.width = time / this.duration * this.progressBarWidth + 'px';
                }
        }, {
                key: 'volumeBarClicked',
                value: function volumeBarClicked(event) {

                        var coords = Player.getClickCoords(event, this.controls.volume.bar);

                        var volume = coords.x / this.volumeBarWidth;

                        this.setVolume(volume);
                }
        }, {
                key: 'progressBarClicked',
                value: function progressBarClicked(event) {

                        var coords = Player.getClickCoords(event, this.controls.progress.bar);

                        this.audio.currentTime = coords.x / this.progressBarWidth * this.duration;
                }
        }, {
                key: 'time',
                value: function time(_time) {

                        _time = new Date(_time * 1000);

                        var hours = _time.getUTCHours(),
                            minutes = _time.getUTCMinutes(),
                            seconds = _time.getUTCSeconds();

                        var output = hours ? hours + ':' : '';

                        if (!minutes) {

                                output += '00:';
                        } else {

                                output += minutes < 10 ? '0' + minutes + ':' : minutes + ':';
                        }

                        if (!seconds) {

                                output += '00';
                        } else {

                                output += seconds < 10 ? '0' + seconds : seconds;
                        }

                        return output;
                }
        }, {
                key: 'duration',
                get: function get() {

                        return this.audio.duration;
                }
        }, {
                key: 'currentTime',
                get: function get() {

                        return this.audio.currentTime;
                }
        }, {
                key: 'formatedTime',
                get: function get() {

                        return this.time(this.currentTime);
                }
        }, {
                key: 'formatedDuration',
                get: function get() {

                        return this.time(this.duration);
                }
        }], [{
                key: 'getClickCoords',
                value: function getClickCoords(event, elem) {

                        var elemOffset = { x: 0, y: 0 };

                        while (elem.offsetParent) {

                                elemOffset.x += elem.offsetLeft;
                                elemOffset.y += elem.offsetTop;

                                elem = elem.offsetParent;
                        }

                        return {
                                x: event.clientX - elemOffset.x + document.body.scrollLeft,
                                y: event.clientY - elemOffset.y + document.body.scrollTop
                        };
                }
        }]);

        return Player;
}();

module.exports = Player;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gallery = function () {
        function Gallery(config) {
                _classCallCheck(this, Gallery);

                this.config = config;

                this.gallery = document.querySelector(config.selector);
                this.children = this.gallery.children.length;
                this.minChildWidth = config.minChildWidth;

                this.prepare();

                window.addEventListener('resize', this.prepare.bind(this));
        }

        _createClass(Gallery, [{
                key: 'prepare',
                value: function prepare() {

                        this.galleryWidth = this.gallery.clientWidth;

                        var childCount = Math.floor(this.galleryWidth / this.minChildWidth);
                        var childWidth = Math.floor(this.galleryWidth / childCount);

                        for (var i = 0; i < this.gallery.children.length; i++) {

                                this.gallery.children[i].style.minWidth = childWidth + 'px';
                        }

                        this.config.indent = this.config.indent || 1;
                        this.childWidth = childWidth + this.config.indent;
                        this.childCount = childCount;
                }
        }, {
                key: 'forward',
                value: function forward(n) {
                        var _this = this;

                        n = n || 1;

                        if (this.moving) return;

                        this.moving = true;

                        var currentScrollLeft = 0,
                            lastScrollLeft = this.gallery.scrollLeft,
                            step = 5;

                        var interval = setInterval(function () {

                                _this.gallery.scrollLeft += n * step;
                                currentScrollLeft += n * step;

                                if (currentScrollLeft >= n * _this.childWidth) {

                                        _this.gallery.scrollLeft = lastScrollLeft + n * _this.childWidth;
                                        clearInterval(interval);
                                        _this.moving = false;
                                }
                        }, 25);
                }
        }, {
                key: 'backward',
                value: function backward(n) {
                        var _this2 = this;

                        n = n || 1;

                        if (this.moving) return;

                        this.moving = true;

                        var currentScrollLeft = 0,
                            lastScrollLeft = this.gallery.scrollLeft,
                            step = 5;

                        var interval = setInterval(function () {

                                _this2.gallery.scrollLeft -= n * step;
                                currentScrollLeft += n * step;

                                if (currentScrollLeft >= n * _this2.childWidth) {

                                        _this2.gallery.scrollLeft = lastScrollLeft - n * _this2.childWidth;
                                        clearInterval(interval);
                                        _this2.moving = false;
                                }
                        }, 15);
                }
        }, {
                key: 'nth',
                value: function nth() {
                        var _this3 = this;

                        var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


                        if (this.moving) return;

                        this.moving = true;

                        var newScrollLeft = this.childWidth * n,
                            lastScrollLeft = this.gallery.scrollLeft,
                            currentScrollLeft = 0;

                        if (newScrollLeft === lastScrollLeft) return;

                        var distance = Math.abs(lastScrollLeft - newScrollLeft),
                            direction = (newScrollLeft - lastScrollLeft) / distance,
                            step = Math.round(distance / this.galleryWidth * 10);

                        var interval = setInterval(function () {

                                _this3.gallery.scrollLeft += direction * step;
                                currentScrollLeft += step;

                                if (currentScrollLeft >= distance) {

                                        _this3.gallery.scrollLeft = newScrollLeft;
                                        clearInterval(interval);
                                        _this3.moving = false;
                                }
                        }, 15);
                }
        }]);

        return Gallery;
}();

module.exports = Gallery;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map