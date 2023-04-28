         TITLE	Factorial

         .386
         .model flat

        extern  _ExitProcess@4:NEAR

        .code
_main:
        push    3
        call    Factorial

        push    0
        call    _ExitProcess@4

;
; Factorial(n)
; Input parameters:
;       n       DWORD
;
        .code
Factorial PROC
n = 8
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    edx

        cmp     DWORD PTR n[ebp],0        ;0! ?
        jne     calculate       ;no
        mov     eax,1           ;Yes, then answer is 1.
        jmp     done
calculate:
        mov     edx,n[ebp]      ;Cacluate n-1
        dec     edx
        push    edx
        call    Factorial       ;ask for (n-1)!

        mul     DWORD PTR n[ebp] ;return n*(n-1)!
done:
        pop     edx
        pop     ebp

        ret     4
Factorial  endp

        end   _main

