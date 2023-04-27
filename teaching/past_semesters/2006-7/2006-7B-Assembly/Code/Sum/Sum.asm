         TITLE SUM

         .386
         .model flat
        extern  _ExitProcess@4:Near
        
        .data
Vec     DWORD   -1,-2,1,2,-3,-4,5,6

        .code
_main:
        mov     eax,OFFSET   Vec
        mov     ecx,LENGTHOF Vec
        mov     ebx,0                
again:
        add     ebx,[eax]
        add     eax,4
        loop    again

        push    0
        call    _ExitProcess@4
        
        end   _main       ;end of program. Label is the entry point.

