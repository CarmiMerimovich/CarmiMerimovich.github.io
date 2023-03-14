         TITLE Powers

         .386
         .model flat

        extern  _ExitProcess@4:Near
        
        .data
        PowerLen=10
PowersVec WORD  PowerLen DUP (?)

        .code                 ;Code area
_main:
        mov     ax,1              ;First power (2^0)
        mov     ebx,0              ;First offset
        mov     ecx,PowerLen       ;Length of Vector
again:
        mov     PowersVec[ebx],ax ;Store power
        add     eax,eax            ;Calculate next power
        add     ebx,2              ;Calculate next offset
        loop    again

        push    0
        call    _ExitProcess@4

        end   _main            ;end of program. Label is the entry point.

