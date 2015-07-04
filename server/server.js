Meteor.startup(function() {
  // Messages.remove({})
  // var today = moment().utc().startOf("day");
  //
  // Messages.insert({
  //   createdAt: today.toDate(),
  //   text: "First message!",
  //   displayDate: today.toDate(),
  //   ip: {}
  // });
  // Messages.insert({
  //   createdAt: today.toDate(),
  //   text: "This is the second one!",
  //   displayDate: today.add(1, "days").toDate(),
  //   ip: {}
  // });
  // Messages.insert({
  //   createdAt: today.toDate(),
  //   text: "And here we go with the third!",
  //   displayDate: today.add(1, "days").toDate(),
  //   ip: {}
  // });

  // var isDisplayed = Messages.find({ display_date: { $ne: false } });
  // var isDisplayedArray = isDisplayed.fetch();
  // var lastDisplayedDate = isDisplayedArray[isDisplayedArray.length - 1].display_date;
  //
  // var needsUpdate = today.diff(moment(lastDisplayedDate).utc(), "days", true) >= 1;
  //
  // console.log(today);
  // console.log(moment(lastDisplayedDate));
  //
  // if(needsUpdate) {
  //   console.log("needs update");
  // }

  // var displayMessage = Messages.find({ display_date: { $ne: false } });

});
