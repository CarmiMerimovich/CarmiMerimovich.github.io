        Title   Insert    (Procedure)

        .386
        .model  flat

        public Insert
;
; InsertLinked(HeadPtr, After, Item)
; Input parameters:
;               HeadPtr   Pointer to head (which points to first element)
;               After     Pointer to item after which we insert
;               Item      Pointer to item to insert
;
        .code
Insert:
HeadPtr  = 8
After    = HeadPtr+4
Item     = After+4
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    esi
        push    edi

        mov     esi,After[ebp]  ;After which element
        mov     edi,Item[ebp]   ;New element

        cmp     esi,0           ;To add as first?
        jne     Normal          ;No, usual handling
        
        mov     esi,HeadPtr[ebp];Yes, add 'after' the header
Normal:
        mov     eax,[esi]      
        mov     [edi],eax
        
        mov     [esi],edi

        pop     edi
        pop     esi

        pop     ebp

        ret     12

        end
