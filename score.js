
var renderer = new frampton.Renderer({
  mediaConfig: mediaConfig,
  videoSourceMaker: function(filename) {
    return '/source/' + filename;
  }
});

var tagger = new frampton.Tagger(mediaConfig);

var tags = [
  'bus', 'bus', 'bus', 'bus', 'bus',
  'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction', 'construction',
  'bird', 'bird', 'bird',
  'food', 'food',
  'hardcore', 'hardcore', 'hardcore',
  'car', 'car', 'car', 'car'
];
tags.forEach(function(tag) {
  tagger.tagVideosWithPattern(tag, tag);
});

var positions = ['left', 'center', 'center', 'right'];

scheduleNewSegment(2000);

function scheduleNewSegment(delay) {
  var video = tagger.randomVideoWithTag(frampton.util.choice(tags));
  var segment = new frampton.VideoSegment(video);

  segment.setVolume(0);
  alterPosition(segment, frampton.util.choice(positions));
  alterTime(segment);

  segment.onStart = function() {
    var delayBetweenVideos = 250 + Math.pow(Math.random(), 3) * 8000;
    var nextDelay = segment.msDuration() + delayBetweenVideos;
    scheduleNewSegment(nextDelay);
  };

  renderer.scheduleSegmentRender(segment, delay);
}

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

  console.log(`start: ${startTime}; duration: ${duration}`);

  segment.setDuration(duration).setStartTime(startTime);
}
