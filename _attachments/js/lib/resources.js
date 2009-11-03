function pluralize(text) {
  text = text.toString().toLowerCase();
  if(text.match(/s$/)) {
   return text;
  } else {
   return text + 's';
  }
}

function template_file_for(resource_path, template){  
 return 'templates/' + pluralize(resource_from_path(resource_path)) + '/' + template + '.mustache';
}

function resource_from_path(path){
 return /^#\/(\w+)(\/|)/.exec(path)[1];;
}

var Resources = function(app, couchapp) {
  this.helpers({
    render: function(template, data, callback) {            
      this.partial(template_file_for(this.path, template), data, callback);
    },
  
    new_object: function(name) {
      var plural_name = name.toLowerCase() + 's';
      this.partial('./templates/' + plural_name + '/new.mustache');
    },
  
    create_object: function(name, params, options, callback) {
      options = options || {};
      var context = this;
      var _prototype = eval(name);
      var object = new _prototype(params);
      console.log(object);
      if(object.valid()) {
        couchapp.db.saveDoc(object.to_json(), {
          success: function(res) {
            if(options.message) {
              trigger('notice', {message: options.message});
            }
            if(options.success) {
              options.success(object);
            }            
            callback(res);
          },
          error: function(response_code, res) {
            trigger('error', {message: 'Error saving ' + name + ': ' + res});
          }
        });
      } else {
        trigger('error', {message: object.errors.join(", ")});
      };
    },
  
    list_objects: function(type, view_name, options, callback) {
      var context = this;      
      var collection = pluralize(type);
      var view = {};
      couchapp.design.view(view_name, {
         include_docs: true,
         success: function(json) { 
           if (json['rows'].length > 0) {
             if (options['sort'] == 'byText') {
               objects = json['rows'].sort(byText);
             } else {
               objects = json['rows'].sort(byDate);
             }
             view[collection] = objects.map(function(row) {return row.doc});
           } else {                   
             view[collection] = [];
           }
           callback(view);
         }
       });
    },
  
    load_object: function(type, id, callback){
      var context = this;
      couchapp.db.openDoc(id, {
        success: function(doc) {
          var _prototype = eval(type);
          var view_prototype = eval(type + 'View');
          var view = new view_prototype(new _prototype(doc));
          if(doc) {
            callback(view);
          } else {
            trigger('error', type + ' with ID "' + id + '" not found.');
          }
        },
        error: function() {
          context.notFound();
        }
      });
    },
  
    object_from_params: function(object_view, params) { 
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
      this.load_object(name, params['id'], function(object_view){
        object_view = context.object_from_params(object_view, params);
        var object = object_view.object();
        object.updated_at = new Date().toJSON();
        if(object.valid()) {
          couchapp.db.saveDoc(object.to_json(), {
            success: function(res) {
              if(options.message) {
                trigger('notice', {message: options.message});
              }
              if(options.success) {
                options.success(object);
              }            
              callback(res);
            },
            error: function(response_code, res) {
              trigger('error', {message: 'Error saving ' + name + ': ' + res});
            }
          });
        } else {
          trigger('error', {message: object.errors.join(", ")});
        };
      });
    } 
  });
};