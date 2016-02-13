Images = new Mongo.Collection("images");

Images.allow({
	insert:function(userId, doc){
		console.log('testing security on image insert');
		if(Meteor.user()){
			if (userId != doc.createdBy){
				return false;
			} else {
				return true;
			}
		}
		return false;
	},
	remove:function(userId, doc){
		console.log('testing security on image remove');
		if(Meteor.user()){
			if (userId != doc.createdBy){
				return false;
			} else {
				return true;
			}
		}
		return false;
	},
	update:function(doc){
		console.log('testing security on image update');
		return true;
	}
})