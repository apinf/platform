## user-feedback 
### - collect, share & manage ideas & issues 

This module allows you to easily add User Idea Generation, Issue Reporting and *New* Chat Support functionality into your Meteor project. 

### Add the package to your module 

**meteor add viloma:user-feedback**

##DEMO
[Here is a Demo](http://user-feedback-demo.meteor.com)

add this to show the feedback link.
```html
{{> userfblink}} 
```

if you want to include feedback form directly in project instead of as a popup add
```html
{{> userfeedback}}
```

You can use settings file to control functionality - e.g. enable/disable chat functionality and have custom feedback categories

settings.json 
```javascript
{
	"public": {
		"userfeedback": {
			//to use custom categories instead of the built in ones
			"categories": [
				{"desc":"Feature Ideas", "id":"idea"},
				{"desc":"Technical Issues", "id":"issue"},
				{"desc":"General Feedback", "id":"general"}
			],
			// to disable chat functionality 
            "enableChat": false
		}
	}
}
```

To select users that are moderators for your site add this to settings.json
```javascript
{
	"userfeedback": {
		"moderators": {
			"your moderator 1 user id ..": 1,
			"your moderator 2 email address ..": 1
		},
        "enableChat": true
	}
}
```

If you are using Roles package - you can assign moderators by adding them to the role **ufb-moderator**

### Details:
- Visitors can view the feedback without signing in
- Only signed in users can create new topics or comment on them.
- moderators defined in settings.json by userId or email address
- For text search through the fields user-feedback creates an index using an undocumented _ensureIndex api call. If the api changes - then index would not be created automatically. You would need to create the index manually on mongo command line.
- Topic creator or Moderator can accept an answer or delete a comment

**db.userfeedback.createIndex({"head":"text", "desc":"text"},{"weights": {"head": 10, "desc": 5,}})');**


### To be added
- surveys
- private ideas

