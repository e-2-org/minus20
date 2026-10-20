on prepareMovie
  global W, M, D, dsktp
  puppetSprite(1, 1)
  puppetSprite(2, 1)
  set W to integer(item 3 of string(the deskTopRectList))
  set D to integer(item 4 of string(the deskTopRectList))
  set M to W / 2
  if (W = 640) or (W = 720) or (W = 800) or (W = 832) or (W = 896) or (W = 1024) or (W = 1152) then
    set the memberNum of sprite 1 to the number of member string("track" & integer(1.5625 * W))
    set the memberNum of sprite 2 to the number of member string("slider" & integer(1.5625 * W))
  else
    if W <= 720 then
      set the memberNum of sprite 1 to 5
      set the memberNum of sprite 2 to 12
    end if
    if (W > 720) and (W <= 896) then
      set the memberNum of sprite 1 to 8
      set the memberNum of sprite 2 to 15
    end if
    if W > 896 then
      set the memberNum of sprite 1 to 10
      set the memberNum of sprite 2 to 17
    end if
  end if
  set the locH of sprite 1 to W / 2
  set the locV of sprite 1 to D / 2
  set the locH of sprite 2 to W / 2
  set the locV of sprite 2 to D / 2
end

on startMovie
  go(1)
  updateStage()
end

on sliderScript
  global W, M, D
  set x to the mouseH - the left of sprite 2
  set wM to the width of member the memberNum of sprite 2
  set hM to the height of member the memberNum of sprite 2
  repeat while the stillDown
    set the locH of sprite 2 to the mouseH - x + (wM / 2)
    if the locH of sprite 2 < integer(W / 3.88600000000000012) then
      set the locH of sprite 2 to integer(W / 3.88600000000000012)
    end if
    if the locH of sprite 2 > integer(W / 1.34499999999999997) then
      set the locH of sprite 2 to integer(W / 1.34499999999999997)
    end if
    if (the mouseV < ((D / 2) - hM)) or (the mouseV > ((D / 2) + hM)) then
      exit repeat
    end if
    set z to the locH of sprite 2
    set the locH of sprite 1 to M + (2 * (M - z))
    updateStage()
  end repeat
  go(the frame)
end
