        TITLE   WriteStr
    
        .386
        .model  flat

        include WinCon.inc
;WriteStr(StrPtr, Len)
;   StrPtr  Points to string to write to console
;   Len     Length of string
; The string is written to the standard console
        .data
Outhandle DWORD 0       ;Output console handle
Written DWORD   ?
        .code
WriteStr Proc
StrPtr=8
Len=StrPtr+4
        push    ebp
        mov     ebp,esp
    
        cmp     OutHandle,0     ;Already initialized?
        jne     SkipHandle      ;Yes

        push    STD_OUTPUT_HANDLE   ;No, so get handle
        call    GetStdHandle
        mov     OutHandle,eax
SkipHandle:
        push    0
        push    OFFSET Written      ;We do not use this one, but we supply it.
        push    Len[ebp]
        push    StrPtr[ebp]
        push    OutHandle
        call    WriteConsole   ;Write to console
    
        pop     ebp
        ret     8
WriteStr Endp
    end