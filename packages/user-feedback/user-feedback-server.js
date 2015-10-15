UserFeedback = new Mongo.Collection("userfeedback");
UserFeedbackMessages = new Mongo.Collection("userfeedbackmessages");

var moderators = {};
// check if user is a moderator - specified in settings - accepts userId or email
// looks up once and then caches for future
function isModerator(user){
  if(user in moderators)
    return moderators[user];
  else
  {
    var ismod = false, email = '---';
    if(user){
      var uRec = Meteor.users.findOne(user);
      if(uRec.emails && uRec.emails.length > 0)
        email = uRec.emails[0].address;
      if(Meteor.settings && Meteor.settings.userfeedback
         && Meteor.settings.userfeedback.moderators
         && (Meteor.settings.userfeedback.moderators[user] || Meteor.settings.userfeedback.moderators[email])
        )
        ismod = true;
    }
    moderators[user] = ismod;
    return ismod;
  }
}

Meteor.publish("userfeedbackmessages", function(userId) {
  var uid = this.userId;
  if(isModerator(uid) && userId)
    uid = userId;

  return UserFeedbackMessages.find({ $and: [ {status: {$gt: 0}}, {$or: [ {from: uid}, {to: uid} ]} ] }, {multi: true});
});

Meteor.startup(function(){
  // text index search requires that index is present
  try{
    UserFeedback._ensureIndex({"head":"text", "desc":"text"},{weights: {"head": 10, "desc": 5,}});

    console.log('index exists');
  }catch(e){
    console.log(e);
    console.log('seems like index could not be reated - this is needed to do search over topic descriptions. '+
                'You can create the index on mongo command line as db.userfeedback.createIndex({"head":"text", "desc":"text"},{"weights": {"head": 10, "desc": 5,}})');
  }
});
Meteor.methods({
  ufbArchiveUserMessages: function(uid){
    if(isModerator(Meteor.userId())){
      var msgs = UserFeedbackMessages.find({ $and: [ {status: 1}, {$or: [ {from: uid}, {to: uid} ]} ] }).fetch();
      console.log('archiving '+uid+' msgs: '+msgs.length);
      for(var v in msgs){
        var msg = msgs[v];
        UserFeedbackMessages.update(msg._id, { $set : {status: 0}});
      }
    }
  },
  initUFB: function(){ // this function is called on opens - returns statistics
    var topicStatus = UserFeedback.find({},{fields:{"status":1}}).fetch();
    var stats = _.countBy(topicStatus,'status');
    stats.atTime = new Date();
    var uId = Meteor.userId();
    stats.isModerator = isModerator(uId);
    var statInfo = JSON.stringify(stats);
    var sort_order = {};
    sort_order["likes"] = -1;
    //return articles.find({}, {sort: sort_order, limit: 1});
    stats.topics = UserFeedback.find({}, {sort:sort_order, limit: 15, fields:{'head':1, 'date':1, 'likes':1, 'unlikes':1, 'category':1, '_id':1, 'status':1, 'commentCount':1, 'username':1}}).fetch();
    console.log('ufb: got stats : '+ statInfo + ' topics: '+stats.topics.length);
    return stats;
  },
  findTopic: function (text, pageNo) {
    check(text, String);

    var res = UserFeedback.find({"$text":{"$search":text}},
                                { fields: {'head':1, 'date':1, 'likes':1, 'unlikes':1, 'category':1, '_id':1, 'status':1, 'commentCount':1, 'username':1, 'date':1 }}).fetch();

    console.log('ufb: findToipc '+ text+ ' got '+res.length);
    return res;
  },
  setTopic: function (head, typ, desc, topicId) {
    if (! Meteor.userId())
      throw new Meteor.Error("log in to create new topic");
    check(head, String);
    check(typ, String);
    check(desc, String);
    if(!topicId){
      var topic = {head: head, date: new Date(), category: typ, desc: desc, likes:0, unlikes:0, category:typ, commentCount: 0, comments:[], userSet:{}, status: "New" };
      topic.owner = Meteor.userId();
      topic.username = Meteor.user().username;
      topicId = UserFeedback.insert(topic);
      console.log('ufb: new topic '+head+' '+desc + ' '+typ);
    }
    else{
      var topic = UserFeedback.findOne({'_id': topicId});
      if(topic.owner === Meteor.userId() || isModerator(Meteor.userId())){
        topic.head = head;
        topic.category = typ;
        topic.desc = desc;
        topic.updated = new Date();
        UserFeedback.update({'_id': topicId}, topic);
        console.log('ufb: updating topic '+head+' '+desc + ' '+typ+ ' '+topicId);
      }
    }
    return UserFeedback.findOne({'_id': topicId});
  },
  getTopicDetails: function (topicId) {
    check(topicId, String);
    return UserFeedback.findOne({_id: topicId});
  },
  updateTopic: function (topicId, type, comment) {
    if (! Meteor.userId())
      throw new Meteor.Error("log in to type on topic");
    check(comment, String);
    check(type, String);
    var ufb = UserFeedback.findOne({'_id': topicId}, {fields:{'likes':1, 'unlikes':1, userSet:1, commentCount:1, 'owner':1,'date':1}});
    var uId = Meteor.userId();
    console.log('ufb: updaing topic id:'+topicId+' type:'+type+ ' comment:'+comment+ ' user:'+uId);
    var updated = false;
    if(type == 'likes'){
      if(!ufb.userSet[uId]){
        var updateSet = {"likes": ufb.likes + 1};
        updateSet["userSet."+uId] = 1;
        UserFeedback.update({'_id': topicId},{"$set":updateSet});
        updated = true;
      }
    }
    else if(type == 'unlikes'){
      if(!ufb.userSet[uId]){
        var updateSet = {"unlikes": ufb.unlikes + 1};
        updateSet["userSet."+uId] = 1;
        UserFeedback.update({'_id': topicId},{"$set": updateSet});
        updated = true;
      }
    }
    else if(type == 'clikes'){
      if(!ufb.userSet[uId+'-'+comment]){
        var updateSet = {};
        updateSet["userSet."+uId+'-'+comment]=1;
        UserFeedback.update({_id: topicId, "comments.id" : parseInt(comment)},
                            { "$inc": { "comments.$.rating" : 1 }, "$set":updateSet });
        updated = true;
      }
    }
    else if(type == 'cunlikes'){
      if(!ufb.userSet[uId+'-'+comment]){
        var updateSet = {};
        updateSet["userSet."+uId+'-'+comment]= -1;
        UserFeedback.update({_id: topicId, "comments.id" : parseInt(comment)},
                            { "$inc": { "comments.$.rating" : -1 }, "$set":updateSet });
        updated = true;
      }
    }
    else if(type == 'accept-answer'){
      UserFeedback.update({_id: topicId, "comments.id" : parseInt(comment)},
                          { "$set": {"comments.$.accepted" : true, "status":"Solved"} });
      updated = true;
    }
    else if(type == 'remove-comment'){
      UserFeedback.update({_id: topicId, "comments.id" : parseInt(comment)},
                          { "$set": {"comments.$.removed" : true} });
      updated = true;
    }
    else if(type == 'comment'){
      var cmt = {"desc":comment, "date": new Date(), "rating": 0};
      cmt.user = Meteor.userId();
      cmt.uName = Meteor.user().username;
      cmt.id = ufb.commentCount + 1;
      UserFeedback.update({_id: topicId},{"$push":{"comments": cmt}, "$set":{ commentCount: cmt.id}});
      updated = true;
    }
    else if(type == 'status'){
      if(ufb.owner === Meteor.userId() || isModerator(Meteor.userId())){
        UserFeedback.update({'_id': topicId},{"$set":{"status": comment}});
        updated = true;
      }
    }
    if(updated)
      console.log("ufb: updateTopic - successfully updated");
    else
      console.log("ufb: updateTopic - did not update for some reason");

    return UserFeedback.findOne({'_id' : topicId});
  }

});
