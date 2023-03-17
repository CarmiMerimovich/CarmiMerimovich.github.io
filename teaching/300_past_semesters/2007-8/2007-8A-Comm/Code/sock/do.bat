@echo on
cl /Zi /c main.cpp
cl /Zi /c comm.cpp

link /debug /out:sock.exe main.obj comm.obj ws2_32.lib