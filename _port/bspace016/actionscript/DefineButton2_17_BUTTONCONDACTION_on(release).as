on(release){
   butCloud += 1;
   if(butCloud % 6 == 0)
   {
      myColor = new Color(this.midClouds);
      myColor.setRGB(0);
      myColor = new Color(this.leftClouds);
      myColor.setRGB(0);
      myColor = new Color(this.rightClouds);
      myColor.setRGB(0);
   }
   else if(butCloud % 6 == 1)
   {
      myColor = new Color(this.midClouds);
      myColor.setRGB(16711714);
      myColor = new Color(this.leftClouds);
      myColor.setRGB(3381657);
      myColor = new Color(this.rightClouds);
      myColor.setRGB(16763904);
   }
   else if(butCloud % 6 == 2)
   {
      myColor = new Color(this.midClouds);
      myColor.setRGB(3381657);
      myColor = new Color(this.leftClouds);
      myColor.setRGB(16763904);
      myColor = new Color(this.rightClouds);
      myColor.setRGB(10066227);
   }
   else if(butCloud % 6 == 3)
   {
      myColor = new Color(this.midClouds);
      myColor.setRGB(16763904);
      myColor = new Color(this.leftClouds);
      myColor.setRGB(10066227);
      myColor = new Color(this.rightClouds);
      myColor.setRGB(16711714);
   }
   else if(butCloud % 6 == 4)
   {
      myColor = new Color(this.midClouds);
      myColor.setRGB(10066227);
      myColor = new Color(this.leftClouds);
      myColor.setRGB(16711714);
      myColor = new Color(this.rightClouds);
      myColor.setRGB(3381657);
   }
   else
   {
      myColor = new Color(this.midClouds);
      myColor.setRGB(16777215);
      myColor = new Color(this.leftClouds);
      myColor.setRGB(16777215);
      myColor = new Color(this.rightClouds);
      myColor.setRGB(16777215);
   }
}
