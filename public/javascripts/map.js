$(document).ready(function(){
  var kMapSize = {width: 700, height: 500};
  function loadUsers(next){
    $.get('/api/v1/friends').success(function(result){
      next(result.users);
    });
  };

  function insertUsers(users){
    var users = users;
    var $elm = $('#search-result');
    $.each(users, function(i, data){
      var $user = $('<div>')
        .attr('class', 'dnp-user')
        .append(
        $('<a>').attr('href', 'http://twiter.com/'+data.screen_name).attr('target', '_blank').append(
          $('<img>').attr('src', data.profile_image_url).attr('class', 'twitter-profile-image'),
          $('<span>').attr('class', 'twitter-name').text(data.screen_name)
        ).draggable()
      );
      $elm.append($user);
    });
  }

  function clearUsers(){
    var $elm = $('#search-result').children().remove();
  }

  loadUsers(insertUsers);

  $('#search').click(function (e) {
    clearUsers();
    $.get('/api/v1/user', {
        q:$('#search-text').val()
     })
    .success(function(result){
        if(result.error){
          alert(result.error);
          return;
        }
        insertUsers(result);
    });
  });
  $('#body-rect').droppable({
    drop: function(e, $ui){
      var point = $ui.draggable.offset();
      var region = $('#map').offset();
      if(
        point.top < region.top  ||
        point.left < region.left ||
        620 < point.top ||
        970 < point.left
        ){
        //$ui.draggable.css('top', '0px').css('left', '0px');
        $ui.draggable.remove();
      }
    }
  });
  $('#map').droppable({
    drop: function(e, $ui) {
      var $label = $ui.draggable.find('span');
      $label.css('display', 'none');

      var offset = $ui.draggable.offset();
      var $clone = $ui.draggable.clone();
      $clone.attr('style', '')
        .css('max-width', 48)
        .css('position', 'absolute')
        .css('top', offset.top-115)
        .css('left', offset.left-300)
        .data('dropped', true).draggable();
      $('#map').append($clone);
      $ui.draggable.remove();
    }
  });
  $('#publish').click(function(){
    var users = [];
    $('#map a.ui-draggable-dragging').each(function(i, item){
      var $item = $(item);
      var offset = $item.offset();
      var user = {
        screen_name: $item.find('.twitter-name').text(),
        profile_image: $item.children('img').attr('src'),
        top: offset.top,
        left: offset.left
      };
      users.push(user);
    });

    if(users.length === 0){
      alert("中に誰もいませんよ");
      return;
    }

    if(!$('#title').val()){
      alert("タイトルがないです");
      return;
    }

    $.post('/api/v1/map',{
        title:$('#title').val(),
        labels:{
          top:$('#top input').val(),
          bottom:$('#bottom input').val(),
          left:$('#left input').val(),
          right:$('#right input').val()
        },
        users: users
      }, function(result){
        if(!result.success){
          alert("失敗しました");
        }else{
          window.location.href = '/map/'+result.map.cid;
        }
     });
  });
});
