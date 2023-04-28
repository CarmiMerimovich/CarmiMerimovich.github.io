         TITLE	BitCount

         .386
         .model flat

        extern  _ExitProcess@4:NEAR
        .code
_main:
        push    311h
        call    BitCount

        push    0
        call    _ExitProcess@4
;
; BitCount(DWORD d)
; Input parameters:
;               DWORD d
;
; Return Value: EAX, the number of 1's in d.
        .data
Vec     DWORD   00000001h,00000002h,00000004h,00000008h,
                00000010h,00000020h,00000040h,00000080h,
                00000100h,00000200h,00000400h,00000800h,
                00001000h,00002000h,00004000h,00008000h,
                00010000h,00020000h,00040000h,00080000h,
                00100000h,00200000h,00400000h,00800000h,
                01000000h,02000000h,04000000h,08000000h,
                10000000h,20000000h,40000000h,80000000h

        .code
BitCount PROC
D  = 8
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    ebx
        push    ecx
        push    esi

        xor     eax,eax         ;eax=0
        mov     ebx,D[ebp]      ;Input dword
        mov     ecx,32          ;Number of bits to check
        mov     esi,OFFSET Vec  ;Bits vector
begin:
        test    ebx,[esi]       ;Check specific bit
        jz      NotSet          ;Not set
        inc     eax
NotSet:
        add     esi,4
        loop    begin


        pop     esi
        pop     ecx
        pop     ebx

        pop     ebp

        ret     4
BitCount endP

        end   _main

