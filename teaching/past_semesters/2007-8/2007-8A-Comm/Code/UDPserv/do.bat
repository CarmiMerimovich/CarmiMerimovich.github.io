cl /Zi /c UDPserv.cpp
link /out:UDPserv.exe /debug /subsystem:console UDPserv.obj  kernel32.lib user32.lib gdi32.lib WS2_32.lib