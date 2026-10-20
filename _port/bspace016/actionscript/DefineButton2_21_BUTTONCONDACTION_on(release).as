on(release){
   butScale += 1;
   if(butScale % 4 == 0)
   {
      this.leftClouds._xscale = 100;
      this.leftClouds._yscale = this.leftClouds._xscale;
      this.midClouds._xscale = 100;
      this.midClouds._yscale = this.midClouds._xscale;
      this.rightClouds._xscale = 100;
      this.rightClouds._yscale = this.rightClouds._xscale;
   }
   else
   {
      this.leftClouds._xscale = random(80) + 60;
      this.leftClouds._yscale = this.leftClouds._xscale;
      this.midClouds._xscale = random(80) + 60;
      this.midClouds._yscale = this.midClouds._xscale;
      this.rightClouds._xscale = random(80) + 60;
      this.rightClouds._yscale = this.rightClouds._xscale;
   }
}
