UserFeedbackMessages = new Mongo.Collection("userfeedbackmessages");
UserFeedbackChats = new Mongo.Collection("userfeedbackchats");

//var modStateTimer;
//function updateModState() {
//    alert("Hello!");
//    Meteor.call('modUpdateStatus');/
//}
Template.userfblink.helpers({
	shouldFlash: function(){
		if(Session.get('ufb-chat-moderator') && !Session.get('showFbChat')){
			var found = UserFeedbackChats.find({live: 1}).fetch();
			if(found.length > 0)
				return "ufb-chat-flash";
		}
		return "";
	}
});
Template.ufbchat.helpers({
	isChatModerator: function(){
		var val = Session.get('ufb-chat-moderator');
		console.log('mod '+val);
		return val;
	},
	list: function(){
		if(Session.get('ufb-chat-moderator')){
			var vals = UserFeedbackChats.find().fetch();
			return UserFeedbackChats.find({}, {sort: {live: -1, lastUpdate: -1}});
		}
	},
	currentName: function(){
		return Session.get('ufb-chat-to-name');
	},
	messages: function(){
		var uid = Meteor.userId();
		if(Session.get('ufb-chat-moderator'))
			uid = Session.get('ufb-chat-to');
		return UserFeedbackMessages.find({$or: [{from: uid}, {to: uid}]}, {sort: {at: 1}} );
	}
});
Template.ufbchat.rendered = function(){
	Meteor.call('initUFBChat', function(err, val){
		if(err)
			console.log(err);
		else
			Session.set('ufb-chat-moderator', val.isChatModerator);
		if(val.isChatModerator){
			Meteor.subscribe("userfeedbackchats");
			// if moderator then update status every 10 minutes
			//- to show "Chat available" - not implemented yet
		    //modStateTimer = setTimeout(updateModState, 60000);
		}
		else
			Meteor.subscribe("userfeedbackmessages");
		console.log('is moderator '+val.isChatModerator);

	});
};
Template.ufbchat.events({
	"click .ufb-chat-close": function (event) {
		Session.set('showFbChat',false);
    },
    "click .ufb-archiveMessages":function(event){
    	Meteor.call('ufbArchiveUserMessages', Session.get('ufb-chat-to'), function(err){
    		if(err)
    			alert('error in clearing '+err);
    	});
    },
    "submit #ufb-send-message": function (event) {
      // search box - find result of topic
      var text = $('.ufb-chat-input').val();
      var to = Session.get('ufb-chat-to');
  		Meteor.call("ufbSendMessage", text, to, function (err, asyncValue) {
			if (err)
				console.log(err);
			else
				$('.ufb-chat-input').val('');
		});
      // Prevent default form submit
      return false;
    },
	"click .ufb-chatuser" :function(event){
		if(event.target.id){
			Session.set('ufb-chat-to', event.target.id);
			Session.set('ufb-chat-to-name', $('#'+event.target.id).text());
			Meteor.subscribe("userfeedbackmessages", event.target.id);
			var ufbChat = UserFeedbackChats.findOne(event.target.id);
			if(ufbChat.live === 1)
				Meteor.call("ufbChatAcknowledged", event.target.id, function(err, val){});
			//UserFeedbackChats.update(event.target.id, {$set: {live: 0}});

		}
	}

});
