         TITLE	BitCount2

         .386
         .model flat

        extern  _ExitProcess@4:NEAR
        .code
_main:
        push    30000000h
        call    BitCount

        push    0
        call    _ExitProcess@4
;
; BitCount(DWORD d)
; Input parameters:
;               DWORD d
;
; Return Value: EAX, the number of 1's in d.
        .code
BitCount PROC
D  = 8
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    ebx
        push    ecx

        xor     eax,eax         ;eax=0
        mov     ebx,D[ebp]      ;Input dword
check:
        test    ebx,ebx         ;Any set bits? (ebx <> 0)
        jz      Done            ;No, then we are done.

        inc     eax             ;Yes, increment bit count
        mov     ecx,ebx         ;Clear the lowest set bit
        dec     ecx
        and     ebx,ecx
        jmp     check
        
Done:
        pop     ecx
        pop     ebx

        pop     ebp

        ret     4
BitCount endP

        end   _main

