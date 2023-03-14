        TITLE   ReadStr
    
        .386
        .model  flat
    
        include WinCon.inc
;ReadStr(StrPtr, Len, Read)
;   StrPtr  Points to buffer to read into
;   Len     Length of buffer
;	Read	Points to number of chars actually read
; A string is read from the standard console. The number of characters
; read is stored into Read.
        .data
InHandle DWORD  0       ;Console input buffer

        .code
ReadStr Proc
StrPtr=8
Len=StrPtr+4
Read=Len+4
        push    ebp
        mov     ebp,esp

        cmp     InHandle,0  ;Already set?
        jne     SkipHandle  ;Yes, so skip GetStdHandle

        push    STD_INPUT_HANDLE
        call    GetStdHandle    ;GetStdHandle if first time
        mov     InHandle,eax    ;and store it for later uses
SkipHandle:
        push    0
        push    DWORD PTR Read[ebp]
        push    DWORD PTR Len[ebp]
        push    DWORD PTR StrPtr[ebp]
        push    InHandle
        call    ReadConsole     ;Read away
    
        pop     ebp
        ret     12
ReadStr Endp
        end