        TITLE   Show
        .386
        .model  flat
        include BinTree.inc
    
; BinTreeShow(node)
;   node    - Poiner to binary tree 
; The elements are shown in order on screen
        .code
BinTreeShow Proc
node=8                      ;BACK TO ONE ARGUMENT
        push    ebp
        mov     ebp,esp
        push    esi             ;save registers

        mov     esi,node[ebp]   ;Pointer to tree

        cmp     esi,0           ;do nothing if empty tree
        je      Done

        push    BinTreeLeft[esi]        ;Show left subtree
        call    BinTreeShow
    
        push    esi
        call    DWORD PTR BinTreeShowRoutine[esi] ;INDIRECT CALL USING ESI
    
        push    BinTreeRight[esi]       ;Show right subtree
        call    BinTreeShow
Done:
        pop     esi
        pop     ebp
        ret     4
BinTreeShow Endp
    
        end