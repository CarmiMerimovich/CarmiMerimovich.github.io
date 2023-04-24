        TITLE   StrLen
        .386
        .model  flat
;StrLen(p)
;   p points to null terminated string
; Return value: In eax the length of the string
        .code
StrLen  Proc
StrPtr=8
        push    ebp
        mov     ebp,esp

        mov     eax,StrPtr[ebp]     ;Begining of string
        dec     eax             ;Prev char
again:  
        inc     eax                 ;Next char
        cmp     BYTE PTR [eax],0    ;Is it null?
        jne     again               ;No, then go on

        sub     eax,StrPtr[ebp]     ;Subtract from null the begining
    
        pop     ebp
        ret     4
StrLen  Endp
        end