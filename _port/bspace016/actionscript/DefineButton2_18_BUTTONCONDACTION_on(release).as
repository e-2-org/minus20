on(release){
   butBack += 1;
   if(butBack % 4 == 1)
   {
      myColor = new Color(this.back);
      myColor.setRGB(16763904);
      myColor = new Color(this.ground);
      myColor.setRGB(16777215);
   }
   else if(butBack % 4 == 2)
   {
      myColor = new Color(this.back);
      myColor.setRGB(10066227);
      myColor = new Color(this.ground);
      myColor.setRGB(16777215);
   }
   else if(butBack % 4 == 3)
   {
      myColor = new Color(this.back);
      myColor.setRGB(3381657);
      myColor = new Color(this.ground);
      myColor.setRGB(16777215);
   }
   else
   {
      myColor = new Color(this.back);
      myColor.setRGB(16711714);
      myColor = new Color(this.ground);
      myColor.setRGB(16777215);
   }
}
