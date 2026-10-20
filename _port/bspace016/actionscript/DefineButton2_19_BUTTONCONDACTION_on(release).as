on(release){
   myColor = new Color(this.midClouds);
   myColorTransform = new Object();
   myColorTransform = {ra:random(200),rb:"0",ga:random(200),gb:"0",ba:random(200),bb:"0",aa:"100",ab:"0"};
   myColor.setTransform(myColorTransform);
   myColor = new Color(this.leftClouds);
   myColorTransform = new Object();
   myColorTransform = {ra:random(200),rb:"0",ga:random(200),gb:"0",ba:random(200),bb:"0",aa:"100",ab:"0"};
   myColor.setTransform(myColorTransform);
   myColor = new Color(this.rightClouds);
   myColorTransform = new Object();
   myColorTransform = {ra:random(200),rb:"0",ga:random(200),gb:"0",ba:random(200),bb:"0",aa:"100",ab:"0"};
   myColor.setTransform(myColorTransform);
}
