        TITLE   NodeDWORD
        .386
        .model  flat
        extern  D2Str10:Near, WriteStr:Near, StrLen:Near
        include bintree.inc
;
; NodeDWORD(p)
; p points to a node of the binary tree
; The node is assumed to have a DWORD value, which is shown on screen
        .data
crlf    BYTE 13,10
        .code
NodeDWORD Proc
node=8
Tmp=-20
locals=-20
        push    ebp
        mov     ebp,esp
        add     esp,locals
        push    esi
    
        mov     esi,node[ebp]
    
        lea     eax,Tmp[ebp]    ;Convert current node value to string
        push    eax
        push    BinTreeValue[esi]
        call    D2Str10

        lea     eax,Tmp[ebp]    ;Show the resulting string
        push    eax
        call    StrLen

        push    eax             ;Add CR/LF after string
        lea     eax,Tmp[ebp]
        push    eax
        call    WriteStr
        push    2
        push    OFFSET crlf
        call    WriteStr
    
        pop     esi
        sub     esp,locals
        pop     ebp
        ret 4
NodeDWORD Endp
        end