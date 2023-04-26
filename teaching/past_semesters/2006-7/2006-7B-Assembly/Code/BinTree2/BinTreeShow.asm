        TITLE   Show
        .386
        .model  flat
        include BinTree.inc
    
; BinTreeShow(node, ShowRoutine)
;   node    - Poiner to binary tree 
;   ShowRoutine - Presentor routine address for a node
; The elements are shown in order on screen
        .code
BinTreeShow Proc
node=8
ShowRoutine=node+4
        push    ebp
        mov     ebp,esp
        push    esi             ;save registers

        mov     esi,node[ebp]   ;Pointer to tree

        cmp     esi,0           ;do nothing if empty tree
        je      Done

        push    ShowRoutine[ebp]
        push    BinTreeLeft[esi]        ;Show left subtree
        call    BinTreeShow
    
        push    esi             ;Call the show routine passed as arg
        call    DWORD PTR ShowRoutine[ebp]
    
        push    ShowRoutine[ebp]
        push    BinTreeRight[esi]       ;Show right subtree
        call    BinTreeShow
Done:
        pop     esi
        pop     ebp
        ret     8
BinTreeShow Endp
    
    end