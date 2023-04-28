        TITLE   NodeSTR
        .386
        .model  flat
        extern  WriteStr:Near, StrLen:Near
        include bintree.inc
;
; NodeSTR(p)
; p points to a node of the binary tree
; The node is assumed to have a null-terminated string value, which is shown on screen
        .data
crlf     BYTE 13,10
        .code
NodeSTR Proc
node=8
        push    ebp
        mov     ebp,esp
        push    esi

        mov     esi,node[ebp]
    
        lea     eax,BinTreeValue[esi]   ;Show the resulting string
        push    eax
        call    StrLen

        push    eax             ;Add CR/LF after string
        lea     eax,BinTreeValue[esi]
        push    eax
        call    WriteStr
        push    2
        push    OFFSET crlf
        call    WriteStr
    
        pop     esi
        pop     ebp
        ret 4
NodeSTR Endp
        end