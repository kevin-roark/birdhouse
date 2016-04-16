
var renderer = new frampton.Renderer({
  mediaConfig: mediaConfig
});

var tagger = new frampton.Tagger(mediaConfig);

var tags = ['bus', 'construction', 'fountain', 'ocean'];
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
    var delayBetweenVideos = Math.random() * 5000 + 500;
    var nextDelay = segment.msDuration() + delayBetweenVideos;
    scheduleNewSegment(nextDelay);
  };

  renderer.scheduleSegmentRender(segment, delay);
}

function alterPosition(segment, style) {
  switch (style) {
    case 'left':
      segment.setLeft('10%').setTop('10%').setWidth('50%');
      break;

    case 'center':
      segment.setLeft('10%').setTop('15%').setWidth('80%');
      break;

    case 'right':
      segment.setLeft('40%').setTop('50%').setWidth('50%');
      break;

    default: break;
  }
}

function alterTime(segment) {
  var maxDuration = Math.max(segment.getDuration(), 6.666);
  var minDuration = 0.3;
  var duration = Math.random() * (maxDuration - minDuration) + minDuration;

  var maxStartTime = segment.getDuration() - duration;
  var startTime = Math.random() * maxStartTime;

  segment.setDuration(duration).setStartTime(startTime);
}
