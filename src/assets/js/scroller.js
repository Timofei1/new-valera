class Scroller {

    constructor(element, scrollBar, config={}) {

        this.config = config;

        if (!element || !element instanceof HTMLElement) return;
        if (scrollBar && !scrollBar instanceof HTMLElement) return;

        this.scrollBar = scrollBar;
        this.scrollContent = element;

        this.prepareScrollBar();

        element.addEventListener('mousewheel', this.mouseWheel.bind(this));

    }

    prepareScrollBar() {

        let bar = this.scrollBar;

        bar.addEventListener('mousedown', this.scrollBarClicked.bind(this));

        this.scrollBar = {
            wrapper: bar,
            rail: bar.querySelector('.scroll-bar__rail'),
            slider: bar.querySelector('.scroll-bar__slider')
        };


    }

    mouseWheel(event) {

        this.fixBody();

        this.scrollBar.slider.classList.add('scroll-bar__slider--scrolling');

        this.scrollBy(event.deltaY);

        if (this.scrollTimer) clearTimeout(this.scrollTimer);

        this.scrollTimer = setTimeout(this.scrollFinished.bind(this), 50);

    }

    updateHeight() {

        this.contentScrollHeight = this.scrollContent.scrollHeight;
        this.contentHeight = this.scrollContent.clientHeight;
        this.barHeight = this.scrollBar.rail.clientHeight;
        this.sliderHeight = Math.round(this.barHeight * this.contentHeight / this.contentScrollHeight);

        this.scrollBar.slider.style.height = this.sliderHeight + 'px';

    }

    scrollFinished() {

        this.scrollBar.slider.classList.remove('scroll-bar__slider--scrolling');
        this.unfixBody();

    }

    scrollBarClicked(event) {

        let coordsOnWrapper = Scroller.getClickCoords(event, this.scrollBar.wrapper),
            coordsOnSlider = Scroller.getClickCoords(event, this.scrollBar.slider);

        this.barClickOffset = coordsOnSlider.y;

        let percents = (coordsOnWrapper.y - this.barClickOffset) / this.barHeight;

        this.scrollTo(percents);

        this.scrollBar.slider.classList.add('scroll-bar__slider--scrolling');

        this.scrollDragHandler = this.scrollBarDragged.bind(this);
        this.barReleasedHandler = this.scrollBarReleased.bind(this);

        document.addEventListener('mousemove', this.scrollDragHandler);

        document.addEventListener('mouseup', this.barReleasedHandler);

    }

    scrollBarDragged(event) {

        let coords = Scroller.getClickCoords(event, this.scrollBar.wrapper);

        let percents = (coords.y - this.barClickOffset) / this.barHeight;

        this.scrollTo(percents);

    }

    scrollBarReleased(event) {

        let coords = Scroller.getClickCoords(event, this.scrollBar.wrapper);

        let percents = (coords.y - this.barClickOffset) / this.barHeight;

        this.scrollTo(percents);
        this.scrollBar.slider.classList.remove('scroll-bar__slider--scrolling');

        document.removeEventListener('mousemove', this.scrollDragHandler);
        document.removeEventListener('mouseup', this.barReleasedHandler);

    }

    scrollTo(percents) {

        if (percents > (this.barHeight - this.sliderHeight) / this.barHeight || percents < 0) return;

        this.scrollBar.slider.style.top = percents * this.barHeight + 'px';
        this.scrollContent.scrollTop = percents * this.contentScrollHeight;

    }

    scrollBy(px) {

        this.scrollContent.scrollTop += px;

        let sliderPosition = Math.round(this.barHeight * this.scrollContent.scrollTop / this.contentScrollHeight);

        this.scrollBar.slider.style.top = sliderPosition + 'px';

        if ((this.scrollContent.scrollTop === 0 ||
            this.scrollContent.scrollTop === this.contentScrollHeight - this.contentHeight) &&
            !this.config.scrollLock) {

            this.scrollBar.slider.classList.remove('scroll-bar__slider--scrolling');
            this.unfixBody();

        }

    }

    static getClickCoords(event, elem) {

        let elemOffset = {x: 0, y: 0};

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

    fixBody() {

        this.documentScrollHandler = function (event) {

            event.preventDefault();

        };

        window.addEventListener('DOMMouseScroll', this.documentScrollHandler);
        window.onwheel = this.documentScrollHandler;

    }

    unfixBody() {

        window.removeEventListener('DOMMouseScroll', this.documentScrollHandler);
        window.onwheel = null;

    }

}

module.exports = Scroller;