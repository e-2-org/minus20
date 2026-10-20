global gcount

on beginSprite me
  gcount = 0
end

on exitFrame
  gcount = gcount + 1
  if gcount <= the number of chars in field "a" then
    put char gcount of field "a" into field "b"
  else
    gcount = 0
  end if
  go(the frame)
end
