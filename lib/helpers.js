if(Meteor.isClient) {

  setNextDisplayDate = function() {
    var remainingMessages = Messages.find(
      { displayDate: { $gt: getTodayUTCMidnight() } },
      { fields: { text: 0, ip: 0 } }
    ).fetch();

    var hasMessage = !_.isEmpty( Session.get("message") );

    if( !_.isEmpty(remainingMessages) ) {
      var nextDisplayDate = moment(remainingMessages[remainingMessages.length - 1].displayDate).add(1, "days").toDate();
      Session.set("nextDisplayDate", nextDisplayDate);
    }
    else {
      var todayUTCMidnight = moment().utc().startOf("day");

      if( hasMessage ) {
        Session.set("nextDisplayDate", todayUTCMidnight.add(1, "days").toDate() );
      }
      else {
        Session.set("nextDisplayDate", todayUTCMidnight.toDate() );
      }
    }
  },

  setMessage = function(date) {

    var displayedMessages = Messages.find(
      { displayDate: { $lte: getTodayUTCMidnight() } },
      { fields: { ip: 0 } }
    ).fetch();

    if( !_.isEmpty(displayedMessages)) {

      var lastMessage = displayedMessages[displayedMessages.length - 1];
      var hasExpired = lastMessage.displayDate < getTodayUTCMidnight();

      if(!hasExpired) {
        Session.set("message", lastMessage.text);
        Session.set("count", displayedMessages.length);
      }
    }
  },

  stylePage = function(text) {

    if(_.isEmpty(text) && text !== "") {
      text = Session.get("message");
    }

    var baseSettings = this.getBaseSettings(text);
    var colorScheme = baseSettings.colorScheme;

    var color1 = "rgb(" + colorScheme[0].r + ", " + colorScheme[0].g + ", " + colorScheme[0].b + ")";
    var color2 = "rgba(" + colorScheme[1].r + ", " + colorScheme[1].g + ", " + colorScheme[1].b + ", " + baseSettings.opacity + ")";

    $("body")
    .css('background-color', color1);
    // .css('background', '-webkit-linear-gradient(' + color1 + ' 20%, ' + color2 + ')');

    $("h1 span, h2, p, a.close, footer, footer a")
    .css("color", color2);

    $("h2, footer a")
    .css("border-bottom-color", color2);

    $("div.button")
    .css("border-color", color2)
    .css("color", color2);

    $("h1 span").removeClass().addClass( baseSettings.fontStyle );
  }

  getBaseSettings = function(text) {

    var opacity, colorScheme, angle, fontStyle;

    if(!_.isEmpty(text)) {

      var letters = this.getLetterFrequency( text );
      var similarity = this.numberArraySimilarity(this.getDefaultLetters(), letters);

      var schemeTypes = ["tri", "complement"];

      opacity = this.mapValue(similarity, 0.91, 0.99, 0.65, 1);
      var color = {
        h: this.mapValue(similarity, 0.91, 0.99, 0, 360),
        s: this.mapValue(similarity, 0.91, 0.99, 0, 1),
        v: this.mapValue(similarity, 0.91, 0.99, 0.3, 0.9)
      };

      colorScheme = Please.make_scheme({
        h: color.h,
        s: color.s,
        v: color.v
      },
      {
        scheme_type: schemeTypes[ Math.round( this.mapValue(similarity, 0.91, 0.99, 0, 1) ) ],
        format: 'rgb'
      });
      colorScheme.sort(function() { return 0.5 - Math.random() });

      fontStyle = "style" + Math.round( this.mapValue(similarity, 0.9175, 0.9875, 1, 90) );
    }
    else {
      opacity = 0.3;
      colorScheme = [{r: 25, g: 25, b: 20}, {r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}];
      fontStyle = "style0";
    }
    return {
      colorScheme: colorScheme,
      opacity: opacity,
      fontStyle: fontStyle
    };
  }

  getDefaultLetters = function() {
    return [
      {
        letter: "a",
        frequency: 8.17
      },
      {
        letter: "b",
        frequency: 1.49
      },
      {
        letter: "c",
        frequency: 2.78
      },
      {
        letter: "d",
        frequency: 4.25
      },
      {
        letter: "e",
        frequency: 12.70
      },
      {
        letter: "f",
        frequency: 2.23
      },
      {
        letter: "g",
        frequency: 2.02
      },
      {
        letter: "h",
        frequency: 6.09
      },
      {
        letter: "i",
        frequency: 6.97
      },
      {
        letter: "j",
        frequency: 0.15
      },
      {
        letter: "k",
        frequency: 0.77
      },
      {
        letter: "l",
        frequency: 4.03
      },
      {
        letter: "m",
        frequency: 2.41
      },
      {
        letter: "n",
        frequency: 6.75
      },
      {
        letter: "o",
        frequency: 7.51
      },
      {
        letter: "p",
        frequency: 1.93
      },
      {
        letter: "q",
        frequency: 0.10
      },
      {
        letter: "r",
        frequency: 5.99
      },
      {
        letter: "s",
        frequency: 6.33
      },
      {
        letter: "t",
        frequency: 9.06
      },
      {
        letter: "u",
        frequency: 2.76
      },
      {
        letter: "v",
        frequency: 0.98
      },
      {
        letter: "w",
        frequency: 2.36
      },
      {
        letter: "x",
        frequency: 0.15
      },
      {
        letter: "y",
        frequency: 1.97
      },
      {
        letter: "z",
        frequency: 0.07
      }
    ];
  }

  getLetterFrequency = function(text) {

    var letters = [];
    var defaultLetters = this.getDefaultLetters();
    text = text.replace(/[^\w]/g, "");
    var textLength = text.length;

    var i;
    for (i=0; i < textLength; i++ ) {

      var character = text.charAt(i).toLowerCase();
      var charCountPos = _.findIndex(letters, { letter: character });

      var isCounting = charCountPos !== -1;
      var isAlphabet = _.findIndex(defaultLetters, { letter: character }) !== -1;

      if (isCounting && isAlphabet) {
        letters[charCountPos].count++;
        letters[charCountPos].frequency = parseFloat((letters[charCountPos].count / textLength * 100).toFixed(2));
      }
      else if(isAlphabet) {
        letters.push({
          letter: character,
          count: 1,
          frequency: parseFloat((1 / textLength * 100).toFixed(2))
        });
      }
    }

    letters = _.sortBy(letters, 'letter');

    for(i=0; i < defaultLetters.length; i++) {

      var isMissing = !letters[i] || (defaultLetters[i].letter !== letters[i].letter);

      if( isMissing ) {
        var letterObj = {
          letter: defaultLetters[i].letter,
          count: 0,
          frequency: 0
        };
        letters.splice(i, 0, letterObj);
      }
    }

    return letters;
  }

  limitCharacters = function(event) {

    var text = $('h1 span').text();
    var limit = 140;

    if(event.which != 8 && text.length > limit) {
      event.preventDefault();
    }
  }

  numberSimilarity = function(a, b, max) {
    var diff, diff1, diff2, distance;

    diff1 = max - a;
    diff2 = max - b;
    diff = Math.abs(diff2 - diff1);
    distance = diff / max;

    return 1 - distance;
  }

  numberArraySimilarity = function(a, b) {

    var i, similarity;

    if (a.length === b.length) {

      i = 0;
      similarity = 0;

      // go through all letters
      while (i < a.length) {
        similarity += this.numberSimilarity(a[i].frequency, b[i].frequency, 100);
        i++;
      }
      return similarity / a.length;
    }
    return 0;
  }

  mapValue = function(x, inMin, inMax, fromValue, toValue) {

    var limitMin = fromValue <= toValue ? fromValue : toValue;
    var limitMax = fromValue >= toValue ? fromValue : toValue;

    var value = (x - inMin) * (toValue - fromValue) / (inMax - inMin) + fromValue;

    if( (value >= limitMin) && (value <= limitMax) ) {
      return value;
    }
    else if(value < limitMin) {
      return limitMin;
    }
    else if(value > limitMax) {
      return limitMax;
    }
  }

  if(Meteor.startup) {
    WebFontConfig = {
      google: {
        families: [
          'Knewave::latin,latin-ext',
          'Lilita+One::latin,latin-ext',
          'Modak::latin,latin-ext',
          'Raleway+Dots::latin,latin-ext',
          'Unica+One::latin,latin-ext',
          'Abril+Fatface::latin,latin-ext',
          'Oswald:700:latin,latin-ext',
          'Open+Sans:800italic:latin,latin-ext',
          'PT+Serif:400:latin,latin-ext',
          'Open+Sans+Condensed:300:latin,latin-ext'//,
          //'Berkshire+Swash::latin,latin-ext'
        ]
      }
    };
    (function() {
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
  }
}

getTodayMidnight = function() {
  return moment().startOf("day").toDate();
}

getTodayUTCMidnight = function() {
  return moment().utc().startOf("day").toDate();
}
