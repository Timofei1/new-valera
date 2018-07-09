class Gallery {

    constructor(config) {

        this.config = config;

        this.gallery = document.querySelector(config.selector);
        this.children = this.gallery.children.length;
        this.minChildWidth = config.minChildWidth;

        this.prepare();

        window.addEventListener('resize', this.prepare.bind(this));

    }

    prepare() {

        this.galleryWidth = this.gallery.clientWidth;

        let childCount = Math.floor(this.galleryWidth / this.minChildWidth);
        let childWidth = Math.floor(this.galleryWidth / childCount);

        for (let i = 0; i < this.gallery.children.length; i++) {

            this.gallery.children[i].style.minWidth = childWidth + 'px';

        }

        this.config.indent = this.config.indent || 1;
        this.childWidth = childWidth + this.config.indent;
        this.childCount = childCount;

    }

    forward(n) {

        n = n || 1;

        if (this.moving) return;

        this.moving = true;

        let currentScrollLeft = 0,
            lastScrollLeft = this.gallery.scrollLeft,
            step = 5;

        let interval = setInterval(() => {

            this.gallery.scrollLeft += n * step;
            currentScrollLeft += n * step;

            if (currentScrollLeft >= n * this.childWidth) {

                this.gallery.scrollLeft = lastScrollLeft + n * this.childWidth;
                clearInterval(interval);
                this.moving = false;

            }

        }, 25);

    }

    backward(n) {

        n = n || 1;

        if (this.moving) return;

        this.moving = true;

        let currentScrollLeft = 0,
            lastScrollLeft = this.gallery.scrollLeft,
            step = 5;

        let interval = setInterval(() => {

            this.gallery.scrollLeft -= n * step;
            currentScrollLeft += n * step;

            if (currentScrollLeft >= n * this.childWidth) {

                this.gallery.scrollLeft = lastScrollLeft - n * this.childWidth;
                clearInterval(interval);
                this.moving = false;

            }

        }, 15);

    }

    nth(n=0) {

        if (this.moving) return;

        this.moving = true;

        let newScrollLeft = this.childWidth * n,
            lastScrollLeft = this.gallery.scrollLeft,
            currentScrollLeft = 0;

        if (newScrollLeft === lastScrollLeft) return;

        let distance = Math.abs(lastScrollLeft - newScrollLeft),
            direction = (newScrollLeft - lastScrollLeft) / distance,
            step = Math.round(distance / this.galleryWidth * 10);

        let interval = setInterval(() => {

            this.gallery.scrollLeft += direction * step;
            currentScrollLeft += step;

            if (currentScrollLeft >= distance) {

                this.gallery.scrollLeft = newScrollLeft;
                clearInterval(interval);
                this.moving = false;

            }

        }, 15);


    }

}

module.exports = Gallery;