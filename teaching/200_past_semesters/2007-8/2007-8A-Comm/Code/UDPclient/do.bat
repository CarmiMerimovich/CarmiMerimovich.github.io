cl /Zi /c UDPclient.cpp
link /out:UDPclient.exe /debug /subsystem:console UDPclient.obj  kernel32.lib user32.lib gdi32.lib WS2_32.lib
