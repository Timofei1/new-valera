// var API = 'http://mbradio.api:8000/';
var API = 'https://api.mbradio.ru/';

var app = angular.module('app', ['ngRoute', 'ngSanitize'])
    .config(function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: '/src/components/grid/grid.tpl.html',
                controller: 'GridController'
            })
            .when('/news/:rubric', {
                templateUrl: '/src/components/feed/feed.tpl.html',
                controller: 'FeedController'
            })
            .when('/publication/:id', {
                templateUrl: '/src/components/publication/publication.tpl.html',
                controller: 'PublicationController'
            })
            .when('/team', {
                templateUrl: '/src/components/team/team.tpl.html',
                controller: 'TeamController'
            })
            .when('/grid', {
                templateUrl: '/src/components/grid/grid.tpl.html',
                controller: 'GridController'
            })
            .when('/broadcast/:uri', {
                templateUrl: '/src/components/broadcast-page/broadcast-page.tpl.html',
                controller: 'BroadcastPageController'
            })
            .when('/become-an-author', {
                templateUrl: '/src/components/become-an-author/become-an-author.tpl.html',
                controller: 'BecomeAnAuthorController'
            })
            .when('/about', {
                templateUrl: '/src/components/about/about.tpl.html',
                controller: 'AboutController'
            })
            .when('/videos', {
                templateUrl: '/src/components/videos/videos.tpl.html',
                controller: 'VideosPageController'
            })
            .when('/newspapers', {
                templateUrl: '/src/components/newspaper/newspaper.tpl.html',
                controller: 'NewspapersPageController'
            })
            .when('/magazines', {
                templateUrl: '/src/components/newspaper/newspaper.tpl.html',
                controller: 'MagazinePageController'
            })
            .when('/tag/:id', {
                templateUrl: '/src/components/feed/feed.tpl.html',
                controller: 'TagController'
            })
            .when('/search', {
                templateUrl: '/src/components/feed/feed.tpl.html',
                controller: 'SearchController'
            })
            .when('/author/:uri', {
                templateUrl: '/src/components/feed/feed.tpl.html',
                controller: 'AuthorController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });


app.controller('BecomeAnAuthorController', function ($rootScope) {

    $rootScope.showAside = false;
    $rootScope.footerTemplate = null;

});

app.controller('AboutController', function ($rootScope) {

    $rootScope.showAside = false;
    $rootScope.footerTemplate = null;

});

app.controller('HeaderController', function ($scope, $location) {

    $scope.openSearch = function () {

        $scope.isSearching = true;

        setTimeout(function () {

            document.getElementById('search').focus();

        }, 10);

    };

    $scope.closeSearch = function () {

        $scope.isSearching = false;

    };

    $scope.submitSearch = function ($event, query) {

        $location.path('/search').search({search: query}).replace();

        $event.preventDefault();

    };

});

app.controller('RadioController', function (RadioService, $scope) {

    $scope.showPlayer = true;
    $scope.liked = false;
    $scope.currentSong = '';

    var getCurrentSong = function () {

        RadioService.getCurrentSong()
            .then(function (song) {

                if ($scope.currentSong === song.title) return;

                $scope.currentSong = song.title;
                $scope.liked = false;

            });

    };

    $scope.like = function () {

        if ($scope.liked) return;

        RadioService.like($scope.currentSong);
        $scope.liked = true;

    };

    setInterval(getCurrentSong, 10000);

    getCurrentSong();

});

app.controller('FooterController', function (FeedService, $scope) {

    FeedService.last()
        .then(function (lastNews) {

            $scope.lastNews = lastNews.slice(0, 3);

        });

});

app.factory('RadioService', function ($http) {

    var getCurrentSong = function () {

        var requestUrl = API + 'radio/currentSong';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var like = function (track) {

        if (!track) return;

        var requestUrl = API + 'radio/like';

        return $http.post(requestUrl, 'track='+track, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    return {
        getCurrentSong: getCurrentSong,
        like: like
    };

});

app.factory('FeedService', function ($http) {

    var PAGE_LIMIT = 12;

    var get = function (page, rubric) {

        var RUBRICS = {
            'relax': 5,
            'editorial': 6,
            'study': 7,
            'science': 8,
            'days': 10
        };

        page = page || 1;

        var offset = (page - 1) * PAGE_LIMIT;

        var requestUrl = API + 'publications?offset=' + offset + '&limit=' + PAGE_LIMIT;

        if (rubric && RUBRICS[rubric]) {

            requestUrl += '&rubric=' + RUBRICS[rubric];

        }


        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var tag = function (tag, limit, offset) {

        if (!tag) return;

        var requestUrl = API + 'tag/' + tag;

        if (limit) {

            requestUrl += '?limit=' + limit;

        }

        if (offset) {

            requestUrl += (limit ? '&' : '?') + 'offset=' + offset;

        }


        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var author = function (uri, limit, offset) {

        if (!uri) return;

        var requestUrl = API + 'author/' + uri;

        if (limit) {

            requestUrl += '?limit=' + limit;

        }

        if (offset) {

            requestUrl += (limit ? '&' : '?') + 'offset=' + offset;

        }


        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var search = function (query, limit, offset) {

        if (!query) return Promise.reject();

        var requestUrl = API + 'search?search=' + query;

        if (limit) {

            requestUrl += '&limit=' + limit;

        }

        if (offset) {

            requestUrl += '&offset=' + offset;

        }


        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };


    var last = function () {

        var requestUrl = API + 'publications/last';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var popular = function () {

        var requestUrl = API + 'publications/popular';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var videos = function (limit, offset) {

        var requestUrl = API + 'publications/videos';

        if (limit) {

            requestUrl += '?limit=' + limit;

        }

        if (offset) {

            requestUrl += limit ? '&' : '?' + 'offset=' + offset;

        }

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };


    return {
        get: get,
        last: last,
        popular: popular,
        videos: videos,
        tag: tag,
        search: search,
        author: author
    };

});

app.factory('BroadcastService', function ($http) {


    var get = function (idOrUri) {

        if (!idOrUri) return {};

        var requestUrl = API + 'broadcast/' + idOrUri;

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };


    var all = function () {

        var requestUrl = API + 'broadcasts';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var last = function () {

        var requestUrl = API + 'broadcasts/last';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var popular = function () {

        var requestUrl = API + 'broadcasts/popular';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };


    return {
        get: get,
        all: all,
        last: last,
        popular: popular
    };

});

app.factory('PublicationService', function ($http) {

    var get = function (id) {

        if (!id) {

            return null;

        }

        var requestUrl = API + 'publication/' + id;

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    return {
        get: get
    };

});

app.factory('NewspaperService', function ($http) {

    var get = function (id) {

        if (!id) {

            return null;

        }

        var requestUrl = API + 'newspaper/' + id;

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var last = function (limit, type) {

        limit = limit || 10;
        type = type || 1;

        var requestUrl = API + 'newspapers?limit=' + limit + '&type=' + type;

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var all = function (limit, offset, type) {

        type = type || 1;

        var requestUrl = API + 'newspapers?type=' + type;

        if (limit) {

            requestUrl += '&limit=' + limit;

        }

        if (offset) {

            requestUrl += '&offset=' + offset;

        }


        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    return {
        get: get,
        last: last,
        all: all
    };

});

app.factory('PodcastsService', function ($http) {

    var last = function () {

        var requestUrl = API + 'podcasts/last';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);


    };

    var all = function (limit, offset) {

        var requestUrl = API + 'podcasts';

        if (limit) {

            requestUrl += '?limit=' + limit;

        }
        if (offset) {

            requestUrl += (limit ? '&' : '?') + 'offset=' + offset;

        }

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    var get = function (id) {

        if (!id) {

            return null;

        }

        var requestUrl = API + 'podcast/' + id;

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    return {
        get: get,
        all: all,
        last: last
    };

});

app.factory('PartnersService', function ($http) {

    var all = function (limit) {

        var requestUrl = API + 'partners';

        if (limit) {

            requestUrl += '?limit=' + limit;

        }

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);


    };

    var get = function (id) {

        if (!id) {

            return null;

        }

        var requestUrl = API + 'partners/' + id;

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    return {
        get: get,
        all: all
    };

});

app.factory('CalendarService', function ($http) {

    var all = function (limit, month, year) {

        var requestUrl = API + 'events';

        if (limit) {

            requestUrl += '?limit=' + limit;

        }

        if (month) {

            requestUrl += (limit ? '&' :'?') + 'month=' + month;

        }
        if (year) {

            requestUrl += (limit || year ? '&' :'?') + 'year=' + year;

        }

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);


    };

    var get = function (id) {

        if (!id) {

            return null;

        }

        var requestUrl = API + 'event/' + id;

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    return {
        get: get,
        all: all
    };

});

app.factory('TeamService', function ($http) {

    var get = function () {

        var requestUrl = API + 'team';

        return $http({
            'url': requestUrl,
            'method': 'GET'
        })
            .then(function (response) {

                return response.data;

            })
            .catch(console.log);

    };

    return {
        get: get
    };

});

app.controller('FeedController', function (FeedService, $scope, $rootScope, $routeParams) {

    var page = 1;

    $scope.loading = true;
    $rootScope.showAside = true;

    $rootScope.footerTemplate = '/src/layouts/main-sections.tpl.html';
    $rootScope.asideTemplate = '/src/components/calendar/calendar.tpl.html';

    $scope.newsList = [];

    var loadPosts = function (page) {

        FeedService.get(page, $routeParams.rubric)
            .then(function (news) {

                var bigItem = news.find(function (element, index) {

                    if (element.size > 1) {

                        this.splice(index, 1);
                        return true;

                    }

                }, news);

                if (bigItem) {

                    bigItem.big = true;
                    news.unshift(bigItem);

                }

                $scope.newsList = $scope.newsList.concat(news);
                $scope.ready = true;
                $scope.loading = false;

                if (news.length < 12) {

                    $scope.hideLoadMoreButton = true;

                }

            });

    };

    $scope.nextPage = function () {

        $scope.loading = true;
        loadPosts(++page);

    };

    loadPosts(page);

});

app.controller('TagController', function (FeedService, $scope, $routeParams, $rootScope) {

    $rootScope.showAside = true;
    $rootScope.asideTemplate = null;
    $rootScope.footerTemplate = null;

    var page = 1;
    var POSTS_LIMIT = 12;

    $scope.loading = true;

    $scope.newsList = [];

    var loadPosts = function (page) {

        var offset = (page - 1) * POSTS_LIMIT;

        FeedService.tag($routeParams.id, POSTS_LIMIT, offset)
            .then(function (data) {

                $scope.tag = data.title;

                var bigItem = data.publications.find(function (element, index) {

                    if (element.size > 1) {

                        this.splice(index, 1);
                        return true;

                    }

                }, data.publications);

                if (bigItem) {

                    bigItem.big = true;
                    data.publications.unshift(bigItem);

                }

                $scope.newsList = $scope.newsList.concat(data.publications);
                $scope.ready = true;
                $scope.loading = false;

                if (data.publications.length < POSTS_LIMIT) {

                    $scope.hideLoadMoreButton = true;

                }

            });

    };

    $scope.nextPage = function () {

        $scope.loading = true;
        loadPosts(++page);

    };

    loadPosts(page);

});

app.controller('AuthorController', function (FeedService, $scope, $routeParams, $rootScope) {

    $rootScope.showAside = true;
    $rootScope.asideTemplate = null;
    $rootScope.footerTemplate = null;

    var page = 1;
    var POSTS_LIMIT = 12;

    $scope.loading = true;

    $scope.newsList = [];

    var loadPosts = function (page) {

        var offset = (page - 1) * POSTS_LIMIT;

        FeedService.author($routeParams.uri, POSTS_LIMIT, offset)
            .then(function (data) {

                $scope.author = data.author;

                var bigItem = data.publications.find(function (element, index) {

                    if (element.size > 1) {

                        this.splice(index, 1);
                        return true;

                    }

                }, data.publications);

                if (bigItem) {

                    bigItem.big = true;
                    data.publications.unshift(bigItem);

                }

                $scope.newsList = $scope.newsList.concat(data.publications);
                $scope.ready = true;
                $scope.loading = false;

                if (data.publications.length < POSTS_LIMIT) {

                    $scope.hideLoadMoreButton = true;

                }

            });

    };

    $scope.nextPage = function () {

        $scope.loading = true;
        loadPosts(++page);

    };

    loadPosts(page);

});

app.controller('SearchController', function (FeedService, $scope, $routeParams, $rootScope) {

    $rootScope.showAside = true;
    $rootScope.asideTemplate = null;
    $rootScope.footerTemplate = null;

    var page = 1;
    var POSTS_LIMIT = 12;

    $scope.loading = true;

    $scope.newsList = [];

    var loadPosts = function (page) {

        var offset = (page - 1) * POSTS_LIMIT;

        FeedService.search($routeParams.search, POSTS_LIMIT, offset)
            .then(function (news) {

                $scope.query = $routeParams.search;

                var bigItem = news.find(function (element, index) {

                    if (element.size > 1) {

                        this.splice(index, 1);
                        return true;

                    }

                }, news);

                if (bigItem) {

                    bigItem.big = true;
                    news.unshift(bigItem);

                }

                $scope.newsList = $scope.newsList.concat(news);
                $scope.ready = true;
                $scope.loading = false;

                if (news.length < POSTS_LIMIT) {

                    $scope.hideLoadMoreButton = true;

                }

            });

    };

    $scope.nextPage = function () {

        $scope.loading = true;
        loadPosts(++page);

    };

    loadPosts(page);

});

app.controller('NewspapersPageController', function (NewspaperService, $scope, $rootScope) {

    $rootScope.showAside = true;
    $rootScope.asideTemplate = null;
    $rootScope.footerTemplate = null;

    var page = 1;
    var TYPEPUB = {
        'newtone': 1,
        'megabyte': 2
    };

    var NEWSPAPERS_LIMIT = 16;

    $scope.newspapers = [];

    var loadNewspapers = function (page) {

        var offset = NEWSPAPERS_LIMIT * (page - 1);

        NewspaperService.all(NEWSPAPERS_LIMIT, offset, TYPEPUB.megabyte)
            .then(function (newspapers) {

                $scope.newspapers = $scope.newspapers.concat(newspapers);

            });

    };

    $scope.nextPage = function () {

        loadNewspapers(++page);

    };

    loadNewspapers(page);

});
app.controller('MagazinePageController', function (NewspaperService, $scope, $rootScope) {

    $rootScope.showAside = true;
    $scope.asideTemplate = null;
    $rootScope.footerTemplate = null;

    var page = 1;
    var TYPEPUB = {
        'newtone': 1,
        'megabyte': 2
    };

    var NEWSPAPERS_LIMIT = 16;

    $scope.newspapers = [];

    var loadNewspapers = function (page) {

        var offset = NEWSPAPERS_LIMIT * (page - 1);

        NewspaperService.all(NEWSPAPERS_LIMIT, offset, TYPEPUB.newtone)
            .then(function (newspapers) {

                $scope.newspapers = $scope.newspapers.concat(newspapers);

            });

    };

    $scope.nextPage = function () {

        loadNewspapers(++page);

    };

    loadNewspapers(page);

});
app.controller('VideosPageController', function (FeedService, $scope, $rootScope) {

    $rootScope.showAside = true;
    $rootScope.asideTemplate = null;
    $rootScope.footerTemplate = null;

    var page = 1;
    var VIDEOS_LIMIT = 12;

    $scope.videos = [];

    $scope.darkVideosTitle = true;

    var loadVideos = function (page) {

        var offset = VIDEOS_LIMIT * (page -1);

        FeedService.videos(VIDEOS_LIMIT, offset)
            .then(function (videos) {

                $scope.videos = $scope.videos.concat(videos);

                if (videos.length < VIDEOS_LIMIT) {

                    $scope.hideLoadMoreButton = true;

                }

            });

    };

    $scope.nextPage = function () {

        loadVideos(++page);

    };

    loadVideos(page);

});

app.controller('PublicationController', function (PublicationService, $scope, $routeParams, $sce, $rootScope) {

    $rootScope.showAside = true;
    $rootScope.asideTemplate = '/src/components/publication/tags.tpl.html';
    $rootScope.footerTemplate = null;


    PublicationService.get($routeParams.id)
        .then(function (publication) {

            var input = angular.element('<div>').html(publication.text),
                iframe = input.find('iframe')[0];

            if (iframe) {

                publication.video = $sce.trustAsHtml(iframe.outerHTML);
                iframe.remove();

            } else {

                var img = publication.img_wide ? publication.img_wide : publication.img;

                publication.cover = angular.element('<img>').attr({src: 'http://mbradio.ru' + img})[0].outerHTML;

            }
            publication.text = input.html();

            $scope.publication = publication;
            $rootScope.tags = publication.tags;
            $scope.ready = true;

        });

});

app.controller('LastNewsController', function (FeedService, $scope) {

    $scope.list = {
        header: 'Последние новости'
    };

    FeedService.last()
        .then(function (lastNews) {

            $scope.list.items = lastNews;
            $scope.ready = true;

        });

});
app.controller('PopNewsController', function (FeedService, $scope) {

    $scope.list = {
        header: 'Популярные новости'
    };

    FeedService.popular()
        .then(function (popNews) {

            $scope.list.items = popNews;
            $scope.ready = true;

        });

});

app.controller('VideosController', function (FeedService, $scope) {

    FeedService.videos()
        .then(function (videos) {

            $scope.videos = videos;

            setTimeout(function () {

                $scope.gallery = new mb.gallery({selector: '.videos__list', minChildWidth: 300, indent: 13});

                $scope.range = new Array(Math.floor($scope.gallery.children / $scope.gallery.childCount));
                $scope.currentSlide = 0;

                $scope.$watch('gallery.childCount', function () {

                    var prevRange = $scope.range.length;

                    $scope.range = new Array(Math.floor($scope.gallery.children / $scope.gallery.childCount));

                    if (prevRange > $scope.range.length) {

                        $scope.currentSlide = 0;
                        $scope.gallery.nth(0);

                    }

                });

            }, 500);

        });

    $scope.moveSlides = function (index) {

        console.log('here');
        $scope.gallery.nth(index * $scope.gallery.childCount);
        $scope.currentSlide = index;

    };

});

app.controller('PopBroadcastsController', function (BroadcastService, PodcastsService, $scope) {

    BroadcastService.popular()
        .then(function (popBcasts) {

            $scope.broadcasts = popBcasts;

            setTimeout(function () {

                $scope.gallery = new mb.gallery({selector: '.podcasts__broadcasts', minChildWidth: 130});

            }, 500);

        });

    PodcastsService.last()
        .then(function (podcast) {

            $scope.podcast = podcast;
            $scope.podcastReady = true;

        });

});

app.controller('NewspapersController', function (NewspaperService, $scope) {

    var TYPEPUB = {
        'newtone': 1,
        'megabyte': 2
    };

    NewspaperService.last(1, TYPEPUB.newtone)
        .then(function (newtone) {

            $scope.newtone = newtone[0];

        });

    NewspaperService.last(4, TYPEPUB.megabyte)
        .then(function (newspapers) {

            $scope.newspaper = newspapers.shift();
            $scope.previous = newspapers;

        });

});


app.controller('PartnersController', function (PartnersService, $scope) {

    PartnersService.all()
        .then(function (partners) {

            $scope.partners = partners;

        });

});

app.controller('CalendarController', function (CalendarService, $scope, $sce) {

    var currentDate = new Date(),
        daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate(),
        firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        weeksInMonth = Math.ceil(daysInMonth / 7);

    $scope.month = currentDate.toLocaleString('ru-RU', {month: 'long'});
    $scope.year = currentDate.getFullYear();
    $scope.days = [];
    $scope.weeks = [];
    $scope.events = {};

    for (var week = 0; week < weeksInMonth; week++) {

        $scope.weeks.push(week);

        for (var day = 0; day < 7; day++) {

            var dayNum = week * 7 + day;

            if (dayNum + 1 > daysInMonth) continue;

            var isActive = week || day + 1 >= firstDay;

            $scope.days[week * 7 + day] = {
                active: isActive,
                num: isActive ? dayNum + 1 : daysInPrevMonth + firstDay + day - 8
            };

        }

    }

    CalendarService.all()
        .then(function (events) {

            events.forEach(function (event) {

                if ($scope.events[event.day]) {

                    $scope.events[event.day].push(event);

                } else {

                    $scope.events[event.day] = [ event ];

                }

            });

            for (var day in $scope.events) {

                var title = '';

                $scope.events[day].forEach(function (event) {

                    title += $sce.trustAsHtml(event.title) + '&#xa&#xa';

                });

                title  = title.slice(0, title.length - 8);

                $scope.events[day].title = title;

            }

        });

});

app.controller('TeamController', function (TeamService, $scope, $rootScope) {

    $rootScope.showAside = false;
    $rootScope.asideTemplate = null;
    $rootScope.footerTemplate = null;

    TeamService.get()
        .then(function (team) {

            $scope.team = team;

        });

});

app.controller('GridController', function (BroadcastService, PodcastsService, $scope, $rootScope) {

    $rootScope.showAside = false;
    $rootScope.footerTemplate = null;

    var PODCASTS_LIMIT = 10,
        page = 1;

    var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    $scope.podcasts = [];

    for (var i = 0; i < 12; i++) {

        $scope.podcasts[i] = [];
        $scope.podcasts[i].month = months[i];

    }

    BroadcastService.all()
        .then(function (broadcasts) {

            $scope.broadcasts = broadcasts;

        });

    var loadPodcasts = function (page) {

        var offset = PODCASTS_LIMIT * (page - 1);

        PodcastsService.all(PODCASTS_LIMIT, offset)
            .then(function (podcasts) {

                var oldPodcasts = $scope.podcasts;

                podcasts.forEach(function (podcast) {

                    var t = podcast.lastup.split(/[- :]/);
                    var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5])),
                        month = date.getMonth();

                    oldPodcasts[month].push(podcast);

                });

                $scope.podcasts = oldPodcasts;

            });

    };

    $scope.nextPage = function () {

        loadPodcasts(++page);

    };

    loadPodcasts(page);

});

app.controller('BroadcastPageController', function (BroadcastService, $scope, $routeParams, $rootScope) {

    $rootScope.showAside = false;
    $rootScope.footerTemplate = null;

    BroadcastService.get($routeParams.uri)
        .then(function (broadcast) {

            $scope.broadcast = broadcast;

        });

});

app.filter('capitalize', function () {

    return function (token) {

        return token.charAt(0).toUpperCase() + token.slice(1);

    };

});

app.filter('decodeHTML', function ($sce) {

    return function (input) {

        if (!input) return;

        input = angular.element('<textarea>').html(input).val();
        return $sce.trustAsHtml(input);

    };

});
app.filter('html', function ($sce) {

    return function (input) {

        return $sce.trustAsHtml(input);

    };

});
app.filter('time', function () {

    return function (input) {

        var t = input.split(/[- :]/);
        var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

        return date.toLocaleString('ru-RU', {hour: '2-digit', minute: '2-digit'});

    };

});
app.filter('date', function () {

    return function (input) {

        if (!input) return;

        var t = input.split(/[- :]/);
        var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

        return date.toLocaleString('ru-RU', {day: '2-digit', month: 'long', year: 'numeric'}).slice(0, -2);

    };

});

app.filter('month', function () {

    return function (input) {

        if (!input) return;

        var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        var year = +input.slice(0, 4),
            month = +input.slice(4, 6);

        month = months[month-1];
        month[0].toUpperCase();

        return month + ' ' + year;

    };

});

app.filter('reverse', function () {

    return function (items) {

        return items.slice().reverse();

    };

});

app.directive('scroller', function () {

    return function (scope, element) {

        let scrollContent = element.children()[0],
            scrollBar = element.children()[1];

        let scroller = new mb.scroller(scrollContent, scrollBar);

        scope.$watch(function () {

            return scrollContent.scrollHeight;

        }, function () {

            scroller.updateHeight();

        });

    };

});

app.directive('radio', function () {

    return function (scope, element) {

        let config = {
            src: 'http://77.234.212.71:8002/live',
            controls: {
                playButton: {
                    element: element[0].querySelector('.player__play-button'),
                    playingClass: 'player__play-button--playing'
                },
                volume: {
                    button: {
                        element: element[0].querySelector('.player__volume-button'),
                        classes: {
                            0: 'player__volume-button--muted',
                            5: 'player__volume-button--middle'
                        }
                    },
                    bar: element[0].querySelector('.player__volume-slider-background'),
                    indicator: element[0].querySelector('.player__volume-slider-indicator')
                }
            }
        };

        let radio = new mb.player(config);

    };

});

app.directive('podcast', function () {

    return {
        restrict: 'A',
        scope: {
            source: '=podcast',
        },
        link: function (scope, element, attrs, ctrl) {

            scope.source = scope.source.replace('http:', 'https:');
            scope.source = scope.source.replace('radio.ifmo.ru', 'mbradio.ru');

            let config = {
                src: scope.source,
                controls: {
                    playButton: {
                        element: element[0].querySelector('.podcast__play-button'),
                        playingClass: 'podcast__play-button--playing'
                    },
                    volume: {
                        bar: element[0].querySelector('.podcast__volume'),
                        indicator: element[0].querySelector('.podcast__volume-indicator')
                    },
                    progress: {
                        bar: element[0].querySelector('.podcast__progress'),
                        indicator: element[0].querySelector('.podcast__progress-indicator'),
                        currentTime: element[0].querySelector('.podcast__time--current'),
                        duration: element[0].querySelector('.podcast__time--duration'),
                    }
                }
            };

            let player = new mb.player(config);

        }
    };

});

app.directive('includeReplace', function () {

    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {

            el.replaceWith(el.children());

        }
    };

});