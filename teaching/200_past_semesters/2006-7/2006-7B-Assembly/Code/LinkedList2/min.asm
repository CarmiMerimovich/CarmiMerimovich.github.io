         TITLE Min   Procedure
         .386
         .model flat

        extern  StrCmp:near
        public  Min
;
; MinkLinked(ptr)
; Input parameters:
;               ptr   Pointer to head (which points to first element)
;
        .code
Min:
HeadPtr = 8
        push    ebp             ;Standard prologue
        mov     ebp,esp

        push    esi
        push    ecx
        push    ebx

        mov     ebx,0           ;Points to minimal string
        mov     esi,HeadPtr[ebp]
        mov     esi,[esi]
        cmp     esi,0
        je      EmptyList

        mov     ebx,esi
        add     ebx,4           ;Set the first to be Minimal!
NextElement:
        mov     esi,[esi]       ;Next element
        cmp     esi,0           ;End of list?
        je      Done            ;Get out.
        mov     ecx,esi         ;Not the end. Need to check for minimality
        add     ecx,4
        push    ecx             ;Current string
        push    ebx             ;Current minimal string
        call    StrCmp          ;Compare strings
        cmp     eax,0
        jl      NextElement     ;Current minimal is not greater the current
        mov     ebx,ecx         ;Current minimal is greater than current.
        jmp     NextElement     ;
Done:
        sub     ebx,4
Emptylist:
        mov     eax,ebx         ;Element with minimal string is returned

        pop     ebx
        pop     ecx
        pop     esi

        pop     ebp
        ret     4

        end
