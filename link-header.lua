local lfs = require("lfs")

io.write("Digite o texto para a linha 15: ")
local novo = io.read("*l")

for file in lfs.dir(".") do
  if file:match("%.html$") then
    local in_f  = assert(io.open(file, "r"))
    local tmp   = file .. ".tmp"
    local out_f = assert(io.open(tmp, "w"))

    local line_num = 0
    for line in in_f:lines() do
      line_num = line_num + 1
      if line_num == 15 then
        out_f:write(novo, "\n")
      else
        out_f:write(line, "\n")
      end
    end

    in_f:close()
    out_f:close()

    -- substituição atômica
    os.remove(file)
    os.rename(tmp, file)
  end
end

