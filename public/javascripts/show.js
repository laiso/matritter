$(document).ready(function(){
  $('#delete').click(function(){
    if(confirm("このマップを削除しますか？")){
      $.post('/api/v1/map/delete', {id: $(this).data('mapid')})
        .success(function(){
          window.location.href = '/';
        });
    }
  });
});
