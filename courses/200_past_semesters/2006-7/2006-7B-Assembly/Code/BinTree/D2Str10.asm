         TITLE D2str10 Convert DWORD to Null-terminated radix-10 string

         .386
         .model flat
;
; D2Str10(unsigned int d, char *StrPtr)
; Input parameters:
;               d        DWORD to convert
; Output parameters:
;               StrPtr   Points to empty place
;
		.code
D2Str10 Proc
D   = 8
StrPtr = D + 4
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    ecx             ;Saving registers we use
        push    edx

        mov     ecx,0           ;Count for number of digits
        mov     eax,D[ebp]      ;Get the DWORD
NextDigit:
        mov     edx,0           ;Prepare to DIV
        
        push    10              ;Temporary 10, since there is no Div Imm
        div     DWORD PTR [esp] ;Divide by 10
        add     esp,4           ;Delete the temporary.
                                ;It is better either to define it statically
                                ;or in the entry to the procedure

        add     edx,'0'         ;Convert the digit to ASCII
        push    dx              ;And save it on stack. (We get the digits in reverse)
        inc     ecx             ;Update digits counter
        
        cmp     eax,0           ;Have we finished?
        jne     NextDigit       ;No. Contiue to next digit.
                                ;Yes.
        mov     eax,StrPtr[ebp] ;Get the string pointer
NextPop:
        pop     dx              ;Pop digit
        mov     [eax],dl        ;Store digit into string
        inc     eax              ;Point to next place
        loop    NextPop         ;Do this for all digits

        mov     BYTE PTR [eax],0;Add the terminating null

        pop     edx             ;Restore registers
        pop     ecx

        pop     ebp

        ret     8
D2Str10 Endp
        end

