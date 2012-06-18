var DOM = {
	selectButton: $("#select"),
	searchBox: $("#search"),
	searchForm: $("#search-form"),
	selectWinner: $("#select"),
	results: $("#tweets"),
	winner: $("#winner"),
	body: $("body")
};

var App = {
	results: [],
	isSearching: false,
	random: function(n) {
		return Math.floor((Math.random()*n));
	},
	setSearching: function(isSearching) {
		App.isSearching = !!isSearching;
		DOM.body.toggleClass('searching', App.isSearching);
	},
	getURL: function(search) {
		return "http://search.twitter.com/search.json?q=" + search + "&callback=?&rpp=200";
	},
	getTweets: function(search, cb) {
		return $.ajax({
			url: App.getURL(search),
			dataType: 'json',
			success: cb,
			error: function() {
				cb();
			}
		});
	},
	fillResults: function(results) {
		var source = $("#tweet-template").html();
		var template = _.template(source);

		App.results = results;
		var html = _.map(results, function(tweet) {
			return '<li>' + template(tweet) + '</li>';
		});

		DOM.results.html(html.join(''));
	},
	buildResults: function(search) {

		if (App.isSearching) {
			return;
		}

		App.setSearching(true);

		App.getTweets(search, function(e) {

			if (!e) {
				throw "No results, Twitter is probably down, please use mock data instead.";
			}

			App.setSearching(false);
			App.fillResults(e.results);
		});
	},
	winner: function(name) {
		DOM.winner.show().text(name);
	},
	raffle: function() {

		DOM.winner.hide();

		var timeForRaffle = App.random(5000) + 5000;
		var now = (new Date()).getTime();

		log("starting raffle", now, timeForRaffle);

		function next() {
			var resultsDOM = DOM.results.find("li");
			var results = App.results;
			resultsDOM.removeClass("active");
			resultsDOM.eq(App.random(resultsDOM.length)).addClass("active");

			var timeLeft =  timeForRaffle - (new Date().getTime() - now);
			var isFinished = timeLeft < 0;

			if (isFinished) {

			}
			else {
				var nextFlip = 1000;// timeLeft / 100;
				setTimeout(next, nextFlip);
			}
		}

		next();
	}
};


// Bind any DOM event handlers
DOM.searchForm.submit(function(e) {
	App.buildResults(DOM.searchBox.val());
	e.preventDefault();
});

DOM.selectWinner.click(function(e) {
	App.raffle();
	e.preventDefault();
});

// Kick off application by searching with whatever is in text box
DOM.selectButton.submit();
