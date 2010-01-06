Notes = function(sammy) { with(sammy) {
  put('#/notes/solve/:id', function() { with(this){
    console.log('hallo in note solve!')
    alert('asfd');
    load_object('Note', params['id'], function(note_view){
      flash = {message: 'Conflict solved.', type: 'notice'};
      redirect('#/outlines/' + note_view.outline_id, flash);
    });
    return false;
  }});
  
  put('#/notes/:id', function()  { with(this) {
    update_object('Note', params, {}, function(note){
      $('#spinner').hide(); 
    });
    return false;
  }});
}};