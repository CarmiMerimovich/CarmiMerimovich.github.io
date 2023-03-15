        TITLE   Show
        .386
        .model  flat
        include BinTree.inc
		extern	NodeDWORD:Near    
; BinTreeShow(node)
;   node    - Poiner to binary tree 
; The elements are shown in order on screen
        .code
BinTreeShow Proc
node=8
        push    ebp
        mov     ebp,esp
        push    esi             ;save registers

        mov     esi,node[ebp]   ;Pointer to tree

        cmp     esi,0           ;do nothing if empty tree
        je      Done

        push    BinTreeLeft[esi]        ;Show left subtree
        call    BinTreeShow
    
        push    esi
        call    NodeDWORD
    
        push    BinTreeRight[esi]       ;Show right subtree
        call    BinTreeShow
Done:
        pop     esi
        pop     ebp
        ret     4
BinTreeShow Endp
    
    end        TITLE   Show
        .386
        .model  flat
        include BinTree.inc
    
        extern  D2Str10:Near
        extern  StrLen:Near,WriteStr:Near
; BinTreeShow(node)
;   node    - Poiner to binary tree 
; The elements are shown in order on screen
        .data
crlf     BYTE 13,10
        .code
BinTreeShow Proc
node=8
Tmp=-20
locals=-20
        push    ebp
        mov     ebp,esp
        add     esp,locals      ;make place for local string
        push    esi             ;save registers

        mov     esi,node[ebp]   ;Pointer to tree

        cmp     esi,0           ;do nothing if empty tree
        je      Done

        push    BinTreeLeft[esi]        ;Show left subtree
        call    BinTreeShow
    
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
    
        push    BinTreeRight[esi]       ;Show right subtree
        call    BinTreeShow
Done:
        pop     esi
        sub     esp,locals
        pop     ebp
        ret     4
BinTreeShow Endp
    
        end