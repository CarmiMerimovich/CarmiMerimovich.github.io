cl /Zi /c main.cpp
link /out:TCPclient.exe /debug /subsystem:console main.obj  kernel32.lib user32.lib gdi32.lib WS2_32.lib