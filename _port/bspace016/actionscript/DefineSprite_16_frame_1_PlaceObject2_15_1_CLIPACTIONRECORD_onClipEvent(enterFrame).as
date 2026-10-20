onClipEvent(enterFrame){
   count += 1;
   if(count % 12 == 1)
   {
      Num1 = Math.floor(Math.random() * ((tilesWide - 4) * (tilesHigh - 4)));
      centretileNum = Num1 + Math.floor(Num1 / (tilesWide - 4)) * 4 + (tilesWide * 2 + 3);
      eval("this.mc" + centretileNum).gotoAndStop(Math.floor(Math.random() * 16) + 1 + framN);
      tileNum = centretileNum - tilesWide;
      NumAdjA = frameName[(eval("this.mc" + (tileNum - tilesWide) + "._currentframe") - 1) * 4 + 2];
      NumAdjC = frameName[(eval("this.mc" + (tileNum + tilesWide) + "._currentframe") - 1) * 4 + 0];
      if(NumAdjA == 1)
      {
         if(NumAdjC == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1111");
         }
         else if(NumAdjC == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1221");
         }
         else if(NumAdjC == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1132");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1242");
         }
      }
      else if(NumAdjA == 2)
      {
         if(NumAdjC == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2311");
         }
         else if(NumAdjC == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2421");
         }
         else if(NumAdjC == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2332");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2442");
         }
      }
      else if(NumAdjA == 3)
      {
         if(NumAdjC == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3113");
         }
         else if(NumAdjC == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3223");
         }
         else if(NumAdjC == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3134");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3244");
         }
      }
      else if(NumAdjC == 1)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4313");
      }
      else if(NumAdjC == 2)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4423");
      }
      else if(NumAdjC == 3)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4334");
      }
      else
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4444");
      }
      tileNum = centretileNum + tilesWide;
      NumAdjA = frameName[(eval("this.mc" + (tileNum - tilesWide) + "._currentframe") - 1) * 4 + 2];
      NumAdjC = frameName[(eval("this.mc" + (tileNum + tilesWide) + "._currentframe") - 1) * 4 + 0];
      if(NumAdjA == 1)
      {
         if(NumAdjC == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1111");
         }
         else if(NumAdjC == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1221");
         }
         else if(NumAdjC == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1132");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1242");
         }
      }
      else if(NumAdjA == 2)
      {
         if(NumAdjC == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2311");
         }
         else if(NumAdjC == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2421");
         }
         else if(NumAdjC == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2332");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2442");
         }
      }
      else if(NumAdjA == 3)
      {
         if(NumAdjC == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3113");
         }
         else if(NumAdjC == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3223");
         }
         else if(NumAdjC == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3134");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3244");
         }
      }
      else if(NumAdjC == 1)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4313");
      }
      else if(NumAdjC == 2)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4423");
      }
      else if(NumAdjC == 3)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4334");
      }
      else
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4444");
      }
      tileNum = centretileNum + 1;
      NumAdjB = frameName[(eval("this.mc" + (tileNum + 1) + "._currentframe") - 1) * 4 + 3];
      NumAdjD = frameName[(eval("this.mc" + (tileNum - 1) + "._currentframe") - 1) * 4 + 1];
      if(NumAdjB == 1)
      {
         if(NumAdjD == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1111");
         }
         else if(NumAdjD == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1132");
         }
         else if(NumAdjD == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3113");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3134");
         }
      }
      else if(NumAdjB == 2)
      {
         if(NumAdjD == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1221");
         }
         else if(NumAdjD == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1242");
         }
         else if(NumAdjD == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3223");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3244");
         }
      }
      else if(NumAdjB == 3)
      {
         if(NumAdjD == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2311");
         }
         else if(NumAdjD == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2332");
         }
         else if(NumAdjD == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "4313");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "4334");
         }
      }
      else if(NumAdjD == 1)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "2421");
      }
      else if(NumAdjD == 2)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "2442");
      }
      else if(NumAdjD == 3)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4423");
      }
      else
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4444");
      }
      tileNum = centretileNum - 1;
      NumAdjB = frameName[(eval("this.mc" + (tileNum + 1) + "._currentframe") - 1) * 4 + 3];
      NumAdjD = frameName[(eval("this.mc" + (tileNum - 1) + "._currentframe") - 1) * 4 + 1];
      if(NumAdjB == 1)
      {
         if(NumAdjD == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1111");
         }
         else if(NumAdjD == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1132");
         }
         else if(NumAdjD == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3113");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3134");
         }
      }
      else if(NumAdjB == 2)
      {
         if(NumAdjD == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1221");
         }
         else if(NumAdjD == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "1242");
         }
         else if(NumAdjD == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3223");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "3244");
         }
      }
      else if(NumAdjB == 3)
      {
         if(NumAdjD == 1)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2311");
         }
         else if(NumAdjD == 2)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "2332");
         }
         else if(NumAdjD == 3)
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "4313");
         }
         else
         {
            eval("this.mc" + tileNum).gotoAndStop(framA + "4334");
         }
      }
      else if(NumAdjD == 1)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "2421");
      }
      else if(NumAdjD == 2)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "2442");
      }
      else if(NumAdjD == 3)
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4423");
      }
      else
      {
         eval("this.mc" + tileNum).gotoAndStop(framA + "4444");
      }
      tileNum = centretileNum - tilesWide - 1;
      NumAdjA = frameName[(eval("this.mc" + (tileNum - tilesWide) + "._currentframe") - 1) * 4 + 2];
      NumAdjB = frameName[(eval("this.mc" + (tileNum + 1) + "._currentframe") - 1) * 4 + 3];
      NumAdjC = frameName[(eval("this.mc" + (tileNum + tilesWide) + "._currentframe") - 1) * 4 + 0];
      NumAdjD = frameName[(eval("this.mc" + (tileNum - 1) + "._currentframe") - 1) * 4 + 1];
      eval("this.mc" + tileNum).gotoAndStop(framA + NumAdjA + NumAdjB + NumAdjC + NumAdjD);
      tileNum = centretileNum - tilesWide + 1;
      NumAdjA = frameName[(eval("this.mc" + (tileNum - tilesWide) + "._currentframe") - 1) * 4 + 2];
      NumAdjB = frameName[(eval("this.mc" + (tileNum + 1) + "._currentframe") - 1) * 4 + 3];
      NumAdjC = frameName[(eval("this.mc" + (tileNum + tilesWide) + "._currentframe") - 1) * 4 + 0];
      NumAdjD = frameName[(eval("this.mc" + (tileNum - 1) + "._currentframe") - 1) * 4 + 1];
      eval("this.mc" + tileNum).gotoAndStop(framA + NumAdjA + NumAdjB + NumAdjC + NumAdjD);
      tileNum = centretileNum + tilesWide - 1;
      NumAdjA = frameName[(eval("this.mc" + (tileNum - tilesWide) + "._currentframe") - 1) * 4 + 2];
      NumAdjB = frameName[(eval("this.mc" + (tileNum + 1) + "._currentframe") - 1) * 4 + 3];
      NumAdjC = frameName[(eval("this.mc" + (tileNum + tilesWide) + "._currentframe") - 1) * 4 + 0];
      NumAdjD = frameName[(eval("this.mc" + (tileNum - 1) + "._currentframe") - 1) * 4 + 1];
      eval("this.mc" + tileNum).gotoAndStop(framA + NumAdjA + NumAdjB + NumAdjC + NumAdjD);
      tileNum = centretileNum + tilesWide + 1;
      NumAdjA = frameName[(eval("this.mc" + (tileNum - tilesWide) + "._currentframe") - 1) * 4 + 2];
      NumAdjB = frameName[(eval("this.mc" + (tileNum + 1) + "._currentframe") - 1) * 4 + 3];
      NumAdjC = frameName[(eval("this.mc" + (tileNum + tilesWide) + "._currentframe") - 1) * 4 + 0];
      NumAdjD = frameName[(eval("this.mc" + (tileNum - 1) + "._currentframe") - 1) * 4 + 1];
      eval("this.mc" + tileNum).gotoAndStop(framA + NumAdjA + NumAdjB + NumAdjC + NumAdjD);
   }
}
