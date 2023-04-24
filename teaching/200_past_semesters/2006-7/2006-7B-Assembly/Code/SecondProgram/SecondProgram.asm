         TITLE P2 Second Program

         .386
         .model flat

         extern _ExitProcess@4:Near

         .data
var1    DWORD   2000H
var2    DWORD   1000H
var3    DWORD   3000h
result  DWORD   ?

        .code                 ;Code area
_main:
        mov     eax,var1          ;EAX=2000h
        sub     eax,var2          ;EAX=1000h
        add     eax,var3          ;EAX=4000h

        mov     result,eax

        push    0
        call    _ExitProcess@4

        end   _main       ;end of program. Label is the entry point.

