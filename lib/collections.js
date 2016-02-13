Images = new Mongo.Collection("images");

Images.allow({
	insert: function(userId, doc){
		console.log('testing security on image insert');
		return false;
	}
})