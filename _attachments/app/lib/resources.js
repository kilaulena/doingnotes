function pluralize(text) {
  text = text.toString().toLowerCase();
  if(text.match(/s$/)) {
   return text;
  } else {
   return text + 's';
  }
}

function template_file_for(resource_path, template){ 
  return 'app/templates/' + pluralize(resource_from_path(resource_path)) + '/' + template + '.mustache';
}

function resource_from_path(path){
  if (/^#\/(\w+)(\/|)/.exec(path)) {
    return /^#\/(\w+)(\/|)/.exec(path)[1];
  } else {
    return path;
  }
}

var Resources = function(app, couchapp) {
  this.helpers({
    render: function(template, data, callback) {            
      this.partial(template_file_for(this.path, template), data, callback);
    },
  
    new_object: function(kind, callback) {
      this.partial(template_file_for(kind, 'new'), callback);
    },
  
    create_object: function(kind, params, options, callback) {
      // console.log('kind', kind)
      // console.log('params', params)
      options = options || {};
      var context = this;
      var _prototype = eval(kind);
      var object = new _prototype(params);
      if(object.valid()) {
        couchapp.db.saveDoc(object.to_json(), {
          success: function(response) {
            // alert('success in create_object')
            console.log('succes in create_object', object.to_json().kind)
            if(typeof(object._id)=="undefined"){
              object._id = response.id;
            }
            if(options.message) {
              context.flash = {message: options.message, type: 'notice'};
            }
            if(options.success) {
              options.success(object);
            }   
            // alert('end of success')       
            callback(object);
          },
          error: function(response_code, response) {
            // console.log('error in create_object', object.to_json().kind)
            // console.log('the error response in create_object is', response)
            
            context.flash = {message: 'Error saving ' + kind + ': ' + response, type: 'error'};
            console.log(context.flash)
            // alert('error in create_object', object.to_json().kind)
            
            context.trigger('error', context.flash);                
          }
        });
      } else {
        context.flash = {message: object.errors.join(", ")};
        context.trigger('error', context.flash);                
      };
    },
  
    list_objects: function(kind, view_name, options, callback) {
      var context = this;      
      var collection = pluralize(kind);
      var view = {};
      var _prototype = eval(kind);
      couchapp.design.view(view_name, {
         success: function(json) { 
           if (json['rows'].length > 0) {   
             view[collection] = json['rows'].map(function(row) {return new _prototype(row.value)});
           } else {                   
             view[collection] = [];
           }
           callback(view);
         }
       });
    },
  
    load_object_view: function(kind, id, callback){
      var context = this;
      couchapp.db.openDoc(id, {
        success: function(doc) {
          var _prototype = eval(kind);
          var view_prototype = eval(kind + 'View');
          var view = new view_prototype(new _prototype(doc));
          if(doc) {            
            callback(view);            
          } else {
            context.flash = {message: kind + ' with ID "' + id + '" not found.', type: 'error'};
          }
        },
        error: function() {
          context.notFound();
        }
      });
    },
  
    object_view_from_params: function(object_view, params) { 
      $.each(params, function(key, value){
        if (typeof(value) == 'string') {
          object_view.object()[key] = value;
        }
      });
      return object_view;
    },
  
    update_object: function(name, params, options, callback) {
      options = options || {};
      var context = this;
      this.load_object_view(name, params['id'], function(object_view){        
        object_view = context.object_view_from_params(object_view, params);
        var object = object_view.object();
        object.updated_at = new Date().toJSON();
        if(object.to_json().kind == 'Note'){
          object.source = context.getLocationHash();
        }
        
        if(object.valid()) {
          couchapp.db.saveDoc(object.to_json(), {
            success: function(res) {
              if(options.message) {     
                context.flash = {message: options.message, type: 'notice'};
              }
              if(options.success) {
                options.success(object);
              }                          
              callback(res);
            },
            error: function(response_code, res) {
              context.flash = {message: 'Error saving ' + name + ': ' + res, type: 'error'};
            }
          });
        } else {
          context.flash = {message: object.errors.join(", ")};
          context.trigger('error', context.flash);                
        };
      });
    },
    
    delete_object: function(params, options, callback) {
      options = options || {};
      var context = this;
      var doc = {_id : params.id, _rev : params.rev};
      couchapp.db.removeDoc(doc, {
        success: function() {
          if(options.message) {
            context.flash = {message: options.message, type: 'notice'};
          }
          callback();
        },
        error: function(response_code, json) {
          context.flash = {message: 'Error deleting object: ' + json, type: 'error'};
        }
      }); 
    }
  });
};