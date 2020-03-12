#!/usr/bin/lua

function fact(n)
    if n == 0 then
        return 1
    else
        return n * fact(n - 1)
    end
end

a = {}

a['name'] = 'link'

b = {}

b['name'] = 'link'

if json.encode(a) == json.encode(b) then
    print("equal")
end

