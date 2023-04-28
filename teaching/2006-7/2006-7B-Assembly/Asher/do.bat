@echo off
rem the following if's process the 2nd and up to the 8th parameter passed to
rem this file as file names, and pass them to the assembler to be compiled into
rem object (.obj) files.
rem each if checks if the corresponding parameter exists.
if not %2x==x ml /Zi /c /coff %2.asm
if not %3x==x ml /Zi /c /coff %3.asm
if not %4x==x ml /Zi /c /coff %4.asm
if not %5x==x ml /Zi /c /coff %5.asm
if not %6x==x ml /Zi /c /coff %6.asm
if not %7x==x ml /Zi /c /coff %7.asm
if not %8x==x ml /Zi /c /coff %8.asm
rem eventually, all files are linked to an executable (.exe) who's name was
rem given as the first parameter ("FirstProgram" replaces %1).
if not %1x==x link /out:%1.exe %2 %3 %4 %5 %6 %7 %8 kernel32.lib /subsystem:console /debug