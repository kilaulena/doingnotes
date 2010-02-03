var Config = {
  DB:     "doingnotes",
  SERVER: "http://localhost:5985",
  HOST:   "http://localhost:5984",
  ENV:    "production", 
  
  LIGHT_RED:   "#FBE3D8",
  LIGHT_GREEN: "#E6EFC2",
  
  onServer: function(){
    return (window.location.protocol + '//' + window.location.host == this.SERVER)
  }
}
