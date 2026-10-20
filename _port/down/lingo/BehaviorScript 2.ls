global neu, neu2

on exitFrame me
  repeat with n = 31 to 181
    if sprite(n).locV > 700 then
      sprite(n).locV = -6
      sprite(n).foreColor = random(256)
      sprite(n).width = random(4) + 1
      neu = 2 * random(350)
    else
      sprite(n).locV = sprite(n).locV + 2
    end if
    if sprite(n).locV = neu then
      sprite(n).foreColor = random(256)
    end if
  end repeat
  repeat with n = 1 to 30
    if sprite(n).locV > 700 then
      sprite(n).locV = -6
      sprite(n).foreColor = random(256)
      neu2 = 4 * random(160)
    else
      sprite(n).locV = sprite(n).locV + 2
    end if
    if sprite(n).locV = neu2 then
      sprite(n).foreColor = random(256)
    end if
  end repeat
  if sprite(182).locV > 700 then
    sprite(182).locV = -20
  else
    sprite(182).locV = sprite(182).locV + 2
  end if
end
