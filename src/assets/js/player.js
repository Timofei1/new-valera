class Player {

    constructor(config) {

        this.processConfig(config);
        this.prepareAudio();
        this.prepareConrtols();

    }

    processConfig(config) {

        this.src = config.src;

        let classes = {
            playButton: {
                playing: null,
            },
            volumeButton: null
        };

        let controls = {
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

    prepareConrtols() {

        let controls = this.controls;

        if (controls.playButton)
            controls.playButton.addEventListener('click', this.togglePlayState.bind(this));

        if (controls.volume.button)
            controls.volume.button.addEventListener('click', this.toggleMuteState.bind(this));

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

    prepareAudio() {

        let self = this;

        let audio = new Audio();

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


    play() {

        if (!this.audio) return;

        if (this.classes.playButton.playing)
            this.controls.playButton.classList.add(this.classes.playButton.playing);

        this.audio.play();

    }

    pause() {

        if (!this.audio) return;

        if (this.classes.playButton.playing)
            this.controls.playButton.classList.remove(this.classes.playButton.playing);

        this.audio.pause();

    }

    mute() {

        this.previousVolume = this.audio.volume;
        this.muted = true;

        this.setVolume(0);

    }

    unmute() {

        let previousVolume = this.previousVolume || 1;

        this.muted = false;

        this.setVolume(previousVolume);

    }

    setVolume(percent) {

        let value = Math.round(percent * 10);

        if (percent) {

            this.muted = false;
            this.previousVolume = percent;

        }

        if (this.controls.volume.button) {

            while (value < 10 && !this.classes.volumeButton[value]) {

                value++;

            }

            let cls = this.classes.volumeButton[value];

            for (let i in this.classes.volumeButton) {

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

    togglePlayState() {

        if (!this.audio) return;

        if (this.audio.paused) {

            this.play();

        } else {

            this.pause();

        }

    }

    toggleMuteState() {

        if (!this.audio) return;

        if (this.muted) {

            this.unmute();

        } else {

            this.mute();

        }

    }

    updateBars() {

        let volume = this.controls.volume,
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

    timeUpdated() {

        if (this.controls.progress.currentTime) {

            this.controls.progress.currentTime.textContent = this.formatedTime;

        }

        if (!this.controls.progress.bar || !this.controls.progress.indicator) return;

        let time = this.currentTime,
            indicator = this.controls.progress.indicator;

        indicator.style.width = time / this.duration * this.progressBarWidth + 'px';


    }

    volumeBarClicked(event) {

        let coords = Player.getClickCoords(event, this.controls.volume.bar);

        let volume = coords.x / this.volumeBarWidth;

        this.setVolume(volume);

    }

    progressBarClicked(event) {

        let coords = Player.getClickCoords(event, this.controls.progress.bar);

        this.audio.currentTime = coords.x / this.progressBarWidth * this.duration;

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

    get duration() {

        return this.audio.duration;

    }

    get currentTime() {

        return this.audio.currentTime;

    }

    get formatedTime() {

        return this.time(this.currentTime);

    }
    get formatedDuration() {

        return this.time(this.duration);

    }

    time(time) {

        time = new Date(time * 1000);

        let hours = time.getUTCHours(),
            minutes = time.getUTCMinutes(),
            seconds = time.getUTCSeconds();

        let output = hours ? hours + ':' : '';

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

}

module.exports = Player;