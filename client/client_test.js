console.log('running on the client');
console.log('');
console.log("             *     ,MMM8&&&.            *");
console.log("                  MMMM88&&&&&    .");
console.log("                 MMMM88&&&&&&&");
console.log("     *           MMM88&&&&&&&&");
console.log("                 MMM88&&&&&&&&");
console.log("                 'MMM88&&&&&&'");
console.log("                   'MMM8&&&'      *");
console.log("          |\\___/|");
console.log("          )     (             .              '");
console.log("         =\\     /=");
console.log("           )===(       *");
console.log("          /     \\");
console.log("          |     |");
console.log("         /       \\");
console.log("         \\       /");
console.log("  _/\\_/\\_/\\__  _/_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_/\\_");
console.log("  |  |  |  |( (  |  |  |  |  |  |  |  |  |  |");
console.log("  |  |  |  | ) ) |  |  |  |  |  |  |  |  |  |");
console.log("  |  |  |  |(_(  |  |  |  |  |  |  |  |  |  |");
console.log("  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |");
console.log("  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |");
console.log(" ");
console.log("         consoleCat - by Bob   (MEOW)");

Session.set("imageLimit", 8);

lastScrollTop = 0;
$(window).scroll(function(event){
  if ($(window).scrollTop() + $(window).height() > $(document).height()-100){
    var scrollTop = $(this).scrollTop();
    if (scrollTop>lastScrollTop){
      Session.set("imageLimit", Session.get("imageLimit")+4);
    }
    lastScrollTop = scrollTop;
  }
});

Template.large_image.helpers({
		img_src: function () {
      return Session.get('large_image_src');
    },
    img_alt: function () {
      return Session.get('large_image_alt');
    }
});

Template.images.helpers({
  images: function(){
    if (Session.get("userFilter")){
      return Images.find({createdBy:Session.get("userFilter")},{sort:{createdOn:-1,rating:-1},limit:Session.get("imageLimit")});
    } else {
      return Images.find({},{sort:{createdOn:-1,rating:-1},limit:Session.get("imageLimit")});
    }
  },
  filtering_images: function(){
    if (Session.get("userFilter")){
      return true;
    } else {
      return false;
    }
  },
  getUser:function(user_id){
    var user = Meteor.users.findOne({_id:user_id});
    if(user){
      return user.username;
    } else {
      return "anon";
    }
  },
  getFilteredUser: function(){
    if (Session.get("userFilter")){
      var user = Meteor.users.findOne({_id:Session.get("userFilter")});
      return user.username;
    } else {
      return "anon";
    }
  }
});

Template.navigation.helpers({username: function(){
  if (Meteor.user()) {
    return Meteor.user().username;;
  }
  else {
    return "";
  }
}

});

Template.navigation.events({
  'click .js-show-image-form': function(event){
    $("#image-form-modal").modal('show');
  }
});

Template.images.events({
  'click .js-image': function(event){
  	var img_src, img_alt;
    img_src = $(event.target).attr('src');
    img_alt = $(event.target).attr('alt');
    Session.set("large_image_src", img_src);
    Session.set("large_image_alt", img_alt);
    console.log(Session.get("large_image_src"));
    console.log(img_src,img_alt)
    $("#large-image-modal").modal('show');
    // var w = $(event.target).width();
    // if (w>50) {
    // $(event.target).css("width","50px");
    // } else {
    //   $(event.target).css("width","252.5px");
    // }
  },
  'click .js-del-image': function(event){
    var image_id = this._id;
    console.log(image_id);
    $('#'+image_id).hide('slow', function(){
      Images.remove({'_id':image_id});
    });   
  },
  'click .js-rate-image': function(event){
    var rating = $(event.currentTarget).data("userrating");
    console.log(rating);
    var image_id = this.id;
    console.log(image_id);
    Images.update({_id:image_id},{$set:{rating:rating}});
  },
  'click .js-set-image-filter': function(event){
    Session.set("userFilter", this.createdBy);
  },
  'click .js-remove-image-filter': function(event){
    Session.set("userFilter", "");
  }
});

Template.image_add_form.events({
  'submit .js-add-image': function(event){
    var img_src, img_alt;
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    console.log('source: '+img_src+" alt: "+img_alt);
    if (Meteor.user()){
      Images.insert({
        img_src:img_src, 
        img_alt:img_alt, 
        createdOn:new Date(),
        createdBy:Meteor.user()._id
      });
    }
    event.target.img_src.value="";
    event.target.img_alt.value="";
    $("#image-form-modal").modal('hide');
    return false;
  },
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});