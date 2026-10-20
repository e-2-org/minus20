on(release){
   butGround += 1;
   if(butGround % 3 == 0)
   {
      this.leftClouds.midClouds.framA = "t";
      this.leftClouds.midClouds.framN = 0;
      this.midClouds.midClouds.framA = "t";
      this.midClouds.midClouds.framN = 0;
      this.rightClouds.midClouds.framA = "t";
      this.rightClouds.midClouds.framN = 0;
      i = 1;
      while(i < 61)
      {
         eval("leftClouds.midClouds.mc" + i).gotoAndStop(eval("leftClouds.midClouds.mc" + i + "._currentframe") - 16);
         eval("midClouds.midClouds.mc" + i).gotoAndStop(eval("midClouds.midClouds.mc" + i + "._currentframe") - 16);
         eval("rightClouds.midClouds.mc" + i).gotoAndStop(eval("rightClouds.midClouds.mc" + i + "._currentframe") - 16);
         i++;
      }
   }
   else if(butGround % 3 == 1)
   {
      this.leftClouds.midClouds.framA = "n";
      this.leftClouds.midClouds.framN = 16;
      this.midClouds.midClouds.framA = "n";
      this.midClouds.midClouds.framN = 16;
      this.rightClouds.midClouds.framA = "n";
      this.rightClouds.midClouds.framN = 16;
      i = 1;
      while(i < 61)
      {
         eval("leftClouds.midClouds.mc" + i).gotoAndStop(eval("leftClouds.midClouds.mc" + i + "._currentframe") + 16);
         eval("midClouds.midClouds.mc" + i).gotoAndStop(eval("midClouds.midClouds.mc" + i + "._currentframe") + 16);
         eval("rightClouds.midClouds.mc" + i).gotoAndStop(eval("rightClouds.midClouds.mc" + i + "._currentframe") + 16);
         i++;
      }
   }
   else
   {
      ranN = random(2);
      if(ranN == 0)
      {
         this.leftClouds.midClouds.framA = "n";
         this.leftClouds.midClouds.framN = 16;
         i = 1;
         while(i < 61)
         {
            eval("leftClouds.midClouds.mc" + i).gotoAndStop((eval("leftClouds.midClouds.mc" + i + "._currentframe") - 1) % 16 + 17);
            i++;
         }
      }
      else
      {
         this.leftClouds.midClouds.framA = "t";
         this.leftClouds.midClouds.framN = 0;
         i = 1;
         while(i < 61)
         {
            eval("leftClouds.midClouds.mc" + i).gotoAndStop((eval("leftClouds.midClouds.mc" + i + "._currentframe") - 1) % 16 + 1);
            i++;
         }
      }
      ranM = random(2);
      if(ranM == 0)
      {
         this.midClouds.midClouds.framA = "n";
         this.midClouds.midClouds.framN = 16;
         i = 1;
         while(i < 61)
         {
            eval("midClouds.midClouds.mc" + i).gotoAndStop((eval("midClouds.midClouds.mc" + i + "._currentframe") - 1) % 16 + 17);
            i++;
         }
      }
      else
      {
         this.midClouds.midClouds.framA = "t";
         this.midClouds.midClouds.framN = 0;
         i = 1;
         while(i < 61)
         {
            eval("midClouds.midClouds.mc" + i).gotoAndStop((eval("midClouds.midClouds.mc" + i + "._currentframe") - 1) % 16 + 1);
            i++;
         }
      }
      if(ranN == 1)
      {
         this.rightClouds.midClouds.framA = "n";
         this.rightClouds.midClouds.framN = 16;
         i = 1;
         while(i < 61)
         {
            eval("rightClouds.midClouds.mc" + i).gotoAndStop((eval("rightClouds.midClouds.mc" + i + "._currentframe") - 1) % 16 + 17);
            i++;
         }
      }
      else
      {
         this.rightClouds.midClouds.framA = "t";
         this.rightClouds.midClouds.framN = 0;
         i = 1;
         while(i < 61)
         {
            eval("rightClouds.midClouds.mc" + i).gotoAndStop((eval("rightClouds.midClouds.mc" + i + "._currentframe") - 1) % 16 + 1);
            i++;
         }
      }
   }
}
