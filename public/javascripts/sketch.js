var Sketch = (function(){
  var Sketch = function(data) {
    if (data) {
      this.id = data.id;
      this.points = data.points || [];
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.new_record = false;
      this.created_at = data.created_at;
      this.address = data.address;
    } else {
      this.id = '' + new Date().getTime();
      this.points = [];
      this.created_at = '';
      this.new_record = true;
      this.address = '';
    }
  }
  
  Sketch.prototype.id = getProperty('id');
  
  Sketch.prototype.append = function(latitude, longitude) {
    this.points.push({
      latitude: latitude,
      longitude: longitude,
      position: this.points.length
    });
  }
  
  Sketch.prototype.save = function(objects) {
    if (!this.new_record || this.points.length < 2) return;
    
    objects.add(this);
    
    var _this = this;
    jQuery.ajax({
      url: '/sketches.json',
      data: {
        sketch: {
          points: this.points
        }
      },
      type: 'POST',
      success: function(data) {
        objects.remove(_this);
        
        var saved_sketch = new Sketch(data);
        objects.add(saved_sketch);
      }
    }); 
  }
  
  Sketch.prototype.polyline = function() {
    var ordered_points = this.points;
    var path = _.map(ordered_points, function(x) { 
      return new google.maps.LatLng(x.latitude, x.longitude)
    });
      
    return new google.maps.Polyline({
      path: path,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }
  
  Sketch.prototype.bounds = function() {
    var bounds = new google.maps.LatLngBounds();

    _.each(this.points, function(p) {
      bounds.extend(new google.maps.LatLng(p.latitude, p.longitude));
    });

    return bounds;
  }
    
    
  return Sketch;
})();
