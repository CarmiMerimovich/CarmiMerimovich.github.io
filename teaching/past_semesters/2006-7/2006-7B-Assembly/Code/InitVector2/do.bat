echo on
if not %2x==x ml /Zi /c /coff %2.asm
if not %3x==x ml /Zi /c /coff %3.asm
if not %4x==x ml /Zi /c /coff %4.asm
if not %5x==x ml /Zi /c /coff %5.asm
if not %6x==x ml /Zi /c /coff %6.asm
if not %7x==x ml /Zi /c /coff %7.asm
if not %8x==x ml /Zi /c /coff %8.asm
if not %1x==x link /out:%1.exe %2 %3 %4 %5 %6 %7 %8 kernel32.lib /subsystem:console /debug