
var renderer = new frampton.Renderer({
  mediaConfig: mediaConfig,
  videoSourceMaker: function(filename) {
    return '/source-converted/' + filename;
  }
});

var tagger = new frampton.Tagger(mediaConfig);

var tags = [
  'bus', 'bus', 'bus', 'bus',
  'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction',
  'bird', 'bird', 'bird',
  'food', 'food',
  'hardcore', 'hardcore',
  'car', 'car', 'car', 'car'
];
tags.forEach(function(tag) {
  tagger.tagVideosWithPattern(tag, tag);
});

var words = 'spread your wings and fly away to a righteous mountain so only you can touch the peak after touch peak dive from top of mountain through sky air plummeting towards ground that are too high ever reach'.split(' ');

var positions = ['left', 'center', 'center', 'right'];

scheduleNewVideoSegment(2000);
scheduleNewTextSegment(3000);

function scheduleNewVideoSegment(delay) {
  var video = tagger.randomVideoWithTag(frampton.util.choice(tags));
  var segment = new frampton.VideoSegment(video);

  segment.setVolume(0);
  alterPosition(segment, frampton.util.choice(positions));
  alterTime(segment);

  segment.onStart = function() {
    var delayBetweenVideos = 250 + Math.pow(Math.random(), 3) * 8000;
    var nextDelay = segment.msDuration() + delayBetweenVideos;
    scheduleNewVideoSegment(nextDelay);
  };

  renderer.scheduleSegmentRender(segment, delay);

  function alterPosition(segment, style) {
    var left, top, width;
    switch (style) {
      case 'left':
        left = Math.random() * 7.5 + 5;
        top = Math.random() * 7.5 + 5;
        width = 50;
        break;

      case 'center':
        width = Math.random() * 15 + 80;
        left = (100 - width) / 2;
        top = left;
        break;

      case 'right':
        left = Math.random() * 7.5 + 36.5;
        top = Math.random() * 7.5 + 26.5;
        width = 50;
        break;
    }

    segment.setLeft(left + '%').setTop(top + '%').setWidth(width + '%');
  }

  function alterTime(segment) {
    var maxDuration = Math.min(segment.getDuration(), 10);
    var minDuration = 0.35;
    var duration = Math.pow(Math.random(), 2.1) * (maxDuration - minDuration) + minDuration;

    var maxStartTime = segment.getDuration() - duration;
    var startTime = Math.random() * maxStartTime;

    segment.setDuration(duration).setStartTime(startTime);
  }
}

function scheduleNewTextSegment(delay) {
  var word = frampton.util.choice(words);
  var segment = new frampton.TextSegment({
    text: word,
    z: 1
  });

  alterPosition(segment);
  alterTime(segment);

  segment.onStart = function() {
    var delayBetweenWords = 250 + Math.random() * 750;
    var nextDelay = segment.msDuration() + delayBetweenWords;
    scheduleNewTextSegment(nextDelay);
  };

  renderer.scheduleSegmentRender(segment, delay);

  function alterPosition(segment) {
    var left = Math.random() * 75 + 5;
    var top = Math.random() * 75 + 5;
    segment.setLeft(left + '%').setTop(top + '%');

    var fontSize = Math.floor(Math.random() * 48) + 48;
    segment.setFontSize(fontSize + 'px');
  }

  function alterTime(segment) {
    var duration = Math.random() * 0.5 + 0.25;
    segment.setDuration(duration);
  }
}
