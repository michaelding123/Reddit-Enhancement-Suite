const POST = {
	A: 't3_5na82d',
	B: 't3_5na82v',
	CWithFlairC: 't3_5na83c',
	aWithFlaira: 't3_5na84d',
	bWithFlairA: 't3_5na84w',
	cWithFlair_a_: 't3_5na85i',
	ABC: 't3_5na86n',
	abc: 't3_5na86a',
	ABCLikeRegex: 't3_5naazi',
	youtubeDomain: 't3_5nacp4',
	restests: 't3_46ymr0',
	RESIntegrationTests2: 't3_5naefx',
	RESIntegrationTests2_A: 't3_5nd9v1',
};

function byId(...posts) {
	return `https://en.reddit.com/by_id/${posts.join(',')}`;
}

function thing(post) {
	return `#thing_${post}`;
}

function editSettings(callback) {
	return (browser, done) => {
		browser
			.url('https://en.reddit.com/wiki/pages/#res:settings-redirect-standalone-options-page/filteReddit')
			.waitForElementVisible('#RESConsoleContainer')
			.perform(callback)
			.click('#moduleOptionsSave');

		done();
	};
}

module.exports = {
	'post title keywords': browser => {
		if (browser.options.desiredCapabilities.browserName === 'firefox') {
			// marionette crashes on setValue
			browser.end();
			return;
		}

		browser
			// basic
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-keywords .addRowButton')
				.setValue('#optionContainer-filteReddit-keywords input', ['B'])
				.click('#optionContainer-filteReddit-keywords .addRowButton')
				.setValue('#optionContainer-filteReddit-keywords tr:nth-child(2) input', ['This shouldn\'t match anything']),
			))
			.url(byId(POST.ABC, POST.A))
			.waitForElementNotVisible(thing(POST.ABC))
			.assert.visible(thing(POST.A))

			// case insensitivity
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-keywords input')
				.setValue('#optionContainer-filteReddit-keywords input', ['b']),
			))
			.url(byId(POST.ABC, POST.A))
			.waitForElementNotVisible(thing(POST.ABC))
			.assert.visible(thing(POST.A))

			// unlesskeyword
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-keywords input')
				.setValue('#optionContainer-filteReddit-keywords input', ['a'])
				.clearValue('#optionContainer-filteReddit-keywords input#keywords_unlessKeyword_0')
				.setValue('#optionContainer-filteReddit-keywords input#keywords_unlessKeyword_0', ['b']),
			))
			.url(byId(POST.ABC, POST.A))
			.waitForElementNotVisible(thing(POST.A))
			.assert.visible(thing(POST.ABC))
			.end();
	},
	'post domains': browser => {
		if (browser.options.desiredCapabilities.browserName === 'firefox') {
			// marionette crashes on setValue
			browser.end();
			return;
		}

		browser
			// self post domain (and case insensitivity)
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-domains .addRowButton')
				.setValue('#optionContainer-filteReddit-domains input', ['sElf.resinTegrAtiontEsts'])
				.click('#optionContainer-filteReddit-domains .addRowButton')
				.setValue('#optionContainer-filteReddit-domains tr:nth-child(2) input', ['This shouldn\'t match anything']),
			))
			.url(byId(POST.ABC, POST.youtubeDomain))
			.waitForElementNotVisible(thing(POST.ABC))
			.assert.visible(thing(POST.youtubeDomain))

			// link post domain
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-domains input')
				.setValue('#optionContainer-filteReddit-domains input', ['youtube.com']),
			))
			.url(byId(POST.ABC, POST.youtubeDomain))
			.waitForElementNotVisible(thing(POST.youtubeDomain))
			.assert.visible(thing(POST.ABC))

			// partial match
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-domains input')
				.setValue('#optionContainer-filteReddit-domains input', ['youtube']),
			))
			.url(byId(POST.ABC, POST.youtubeDomain))
			.waitForElementNotVisible(thing(POST.youtubeDomain))
			.assert.visible(thing(POST.ABC))
			.end();
	},
	'post subreddits': browser => {
		if (browser.options.desiredCapabilities.browserName === 'firefox') {
			// marionette crashes on setValue
			browser.end();
			return;
		}

		browser
			// basic, posted to subreddit
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-subreddits .addRowButton')
				.setValue('#optionContainer-filteReddit-subreddits input', ['RESIntegrationTests'])
				.click('#optionContainer-filteReddit-subreddits .addRowButton')
				.setValue('#optionContainer-filteReddit-subreddits tr:nth-child(2) input', ['This shouldn\'t match anything']),
			))
			.url(byId(POST.ABC, POST.restests))
			.waitForElementNotVisible(thing(POST.ABC))
			.assert.visible(thing(POST.restests))

			// basic, browsing subreddit (should not filter by default)
			.url(`https://en.reddit.com/r/RESIntegrationTests/new/?after=${POST.B}&limit=1`)
			.pause(1000)
			.assert.visible(thing(POST.A))

			// case insensitivity
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-subreddits input')
				.setValue('#optionContainer-filteReddit-subreddits input', ['resinTegrAtiontEsts']),
			))
			.url(byId(POST.ABC, POST.restests))
			.waitForElementNotVisible(thing(POST.ABC))
			.assert.visible(thing(POST.restests))

			// ensure full match
			.url(byId(POST.ABC, POST.RESIntegrationTests2))
			.waitForElementNotVisible(thing(POST.ABC))
			.assert.visible(thing(POST.RESIntegrationTests2))
			.end();
	},
	'post flair': browser => {
		if (browser.options.desiredCapabilities.browserName === 'firefox') {
			// marionette crashes on setValue
			browser.end();
			return;
		}

		browser
			// basic (and case insensitivity)
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-flair .addRowButton')
				.setValue('#optionContainer-filteReddit-flair input', ['A'])
				.click('#optionContainer-filteReddit-flair .addRowButton')
				.setValue('#optionContainer-filteReddit-flair tr:nth-child(2) input', ['This shouldn\'t match anything']),
			))
			.url('https://en.reddit.com/r/RESIntegrationTests/search?q=flair%3Aa+OR+flair%3Ac&restrict_sr=on&t=all&feature=legacy_search')
			.waitForElementNotVisible(thing(POST.aWithFlaira))
			.waitForElementNotVisible(thing(POST.bWithFlairA))
			.waitForElementNotVisible(thing(POST.cWithFlair_a_))
			.assert.visible(thing(POST.CWithFlairC))

			// [flair] isn't treated as a regex set (which filters `f`)
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-flair input')
				.setValue('#optionContainer-filteReddit-flair input', ['[a]']),
			))
			.url('https://en.reddit.com/r/RESIntegrationTests/search?q=flair%3Aa&restrict_sr=on&t=all&feature=legacy_search')
			.waitForElementNotVisible(thing(POST.cWithFlair_a_))
			.assert.visible(thing(POST.aWithFlaira))
			.end();
	},
	'regex filters': browser => {
		if (browser.options.desiredCapabilities.browserName === 'firefox') {
			// marionette crashes on setValue
			browser.end();
			return;
		}

		browser
			// basic title regex filter
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-keywords .addRowButton')
				.setValue('#optionContainer-filteReddit-keywords input', ['/A/'])
				.click('#optionContainer-filteReddit-keywords .addRowButton')
				.setValue('#optionContainer-filteReddit-keywords tr:nth-child(2) input', ['This shouldn\'t match anything']),
			))
			.url(byId(POST.ABC, POST.B))
			.waitForElementNotVisible(thing(POST.ABC))
			.assert.visible(thing(POST.B))

			// basic subreddit regex filter
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-keywords input')
				.click('#optionContainer-filteReddit-subreddits .addRowButton')
				.clearValue('#optionContainer-filteReddit-subreddits input')
				.setValue('#optionContainer-filteReddit-subreddits input', ['/\\wIntegrationTests(?!2)/'])
				.click('#optionContainer-filteReddit-subreddits .addRowButton')
				.setValue('#optionContainer-filteReddit-subreddits tr:nth-child(2) input', ['This shouldn\'t match anything']),
			))
			.url(byId(POST.B, POST.RESIntegrationTests2))
			.waitForElementNotVisible(thing(POST.B))
			.assert.visible(thing(POST.RESIntegrationTests2))

			// case sensitivity
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-subreddits input')
				.setValue('#optionContainer-filteReddit-subreddits input', ['/inTegrAtiontEsts/']),
			))
			.url(byId(POST.B, POST.RESIntegrationTests2))
			.pause(1000)
			.assert.visible(thing(POST.B))
			.assert.visible(thing(POST.RESIntegrationTests2))

			// flags (case insensitivity)
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-subreddits input')
				.setValue('#optionContainer-filteReddit-subreddits input', ['/inTegrAtiontEsts/i']),
			))
			.url(byId(POST.B, POST.RESIntegrationTests2))
			.waitForElementNotVisible(thing(POST.B))
			.waitForElementNotVisible(thing(POST.RESIntegrationTests2))
			.end();
	},
	'limiting to subreddit': browser => {
		if (browser.options.desiredCapabilities.browserName === 'firefox') {
			// doesn't work with geckodriver and I can't figure out why
			browser.end();
			return;
		}

		browser
			// only these subreddits (posted to)
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-keywords .addRowButton')
				.setValue('#optionContainer-filteReddit-keywords input', ['A'])
				.click('#optionContainer-filteReddit-keywords .addRowButton')
				.setValue('#optionContainer-filteReddit-keywords tr:nth-child(2) input', ['This shouldn\'t match anything'])
				.execute(`
					document.querySelector('#optionContainer-filteReddit-keywords input#keywords_subreddits_1').value = 'RESIntegrationTests';
				`)
				.click('#optionContainer-filteReddit-keywords input#keywords_filteRedditApplyTo_1-2' /* only on */),
			))
			.url(byId(POST.A, POST.RESIntegrationTests2_A))
			.waitForElementNotVisible(thing(POST.A))
			.assert.visible(thing(POST.RESIntegrationTests2_A))

			// only these subreddits (when browsing)
			.url(`https://en.reddit.com/r/RESIntegrationTests/new/?after=${POST.CWithFlairC}&limit=2`)
			.waitForElementNotVisible(thing(POST.A))
			.assert.visible(thing(POST.B))

			// except these subreddits (posted to)
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-keywords input#keywords_filteRedditApplyTo_0-1' /* everywhere but */),
			))
			.url(byId(POST.A, POST.RESIntegrationTests2_A))
			.waitForElementNotVisible(thing(POST.RESIntegrationTests2_A))
			.assert.visible(thing(POST.A))

			// except these subreddits (when browsing)
			.url(`https://en.reddit.com/r/RESIntegrationTests/new/?after=${POST.B}&limit=2`)
			.pause(1000)
			.assert.visible(thing(POST.A))

			// case insensitivity (only these subreddits)
			.perform(editSettings(() => browser
				.execute(`
					document.querySelector('#optionContainer-filteReddit-keywords input#keywords_subreddits_0').value = 'resinTegrAtiontEsts';
				`)
				.click('#optionContainer-filteReddit-keywords input#keywords_filteRedditApplyTo_0-2' /* only on */),
			))
			.url(byId(POST.A, POST.RESIntegrationTests2_A))
			.waitForElementNotVisible(thing(POST.A))
			.assert.visible(thing(POST.RESIntegrationTests2_A))

			// browsing /r/all special case (only these subreddits)
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-keywords input')
				.setValue('#optionContainer-filteReddit-keywords input', ['/./'])
				.execute(`
					document.querySelector('#optionContainer-filteReddit-keywords input#keywords_subreddits_0').value = 'all';
				`)
				.click('#optionContainer-filteReddit-keywords input#keywords_filteRedditApplyTo_0-2' /* only on */),
			))
			.url('https://en.reddit.com/r/all/?limit=1')
			.waitForElementNotVisible('#siteTable .thing' /* first thing */)

			// browsing /r/all special case (except these subreddits)
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-keywords input#keywords_filteRedditApplyTo_0-1' /* everywhere but */),
			))
			.url('https://en.reddit.com/r/all/?limit=1')
			.pause(1000)
			.assert.visible('#siteTable .thing' /* first thing */)

			// browsing /r/popular special case (only these subreddits)
			.perform(editSettings(() => browser
				.clearValue('#optionContainer-filteReddit-keywords input')
				.setValue('#optionContainer-filteReddit-keywords input', ['/./'])
				.execute(`
					document.querySelector('#optionContainer-filteReddit-keywords input#keywords_subreddits_0').value = 'popular';
				`)
				.click('#optionContainer-filteReddit-keywords input#keywords_filteRedditApplyTo_0-2' /* only on */),
			))
			.url('https://en.reddit.com/r/popular/?limit=1')
			.waitForElementNotVisible('#siteTable .thing' /* first thing */)

			// browsing /r/popular special case (except these subreddits)
			.perform(editSettings(() => browser
				.click('#optionContainer-filteReddit-keywords input#keywords_filteRedditApplyTo_0-1' /* everywhere but */),
			))
			.url('https://en.reddit.com/r/popular/?limit=1')
			.pause(1000)
			.assert.visible('#siteTable .thing' /* first thing */)
			.end();
	},
};
