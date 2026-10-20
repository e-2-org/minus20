on(release){
   butGround += 1;
   if(butGround % 4 == 0)
   {
      myColor = new Color(this.ground);
      myColor.setRGB(16777215);
      myColor = new Color(this.back);
      myColorTransform = new Object();
      myColorTransform = {ra:random(200),rb:"0",ga:random(200),gb:"0",ba:random(200),bb:"0",aa:"100",ab:"0"};
      myColor.setTransform(myColorTransform);
   }
   else
   {
      myColor = new Color(this.ground);
      myColorTransform = new Object();
      myColorTransform = {ra:random(200),rb:"0",ga:random(200),gb:"0",ba:random(200),bb:"0",aa:"100",ab:"0"};
      myColor.setTransform(myColorTransform);
      myColor = new Color(this.back);
      myColorTransform = new Object();
      myColorTransform = {ra:random(200),rb:"0",ga:random(200),gb:"0",ba:random(200),bb:"0",aa:"100",ab:"0"};
      myColor.setTransform(myColorTransform);
   }
}
