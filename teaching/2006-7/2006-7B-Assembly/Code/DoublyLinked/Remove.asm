         TITLE Remove from Doubly linked list.  (Procedure)

         .386
         .model flat

        include doubly.inc
;
; Remove(HeadPtr, Item)
; Input parameters:
;               HeadPtr   Pointer to head (which points to first/last element)
;               Item      Pointer to item to remove
;

        .code
Remove  PROC
HeadPtr = 8
Item    = HeadPtr+4

        push    ebp
        mov     ebp,esp
        push    edi
        push    esi
        push    ebx

        mov     eax,Item[ebp]   ;Item
        mov     edi,prev[eax]   ;Prev
        mov     ebx,next[eax]   ;Next

        cmp     edi,0           ;Is it the first item?
        jne     NotFirst        ;No.
        mov     edi,HeadPtr[ebp];Fake the header as previous.
NotFirst:
        mov     next[edi],ebx

        cmp     ebx,0           ;Is it last item?
        jne     NotLast         ;No.
        mov     ebx,HeadPtr[ebp];Fake the header as next.
NotLast:
        mov     prev[ebx],esi

        mov     DWORD PTR prev[eax],0   ;Better to load EAX with 0, and store it
        mov     DWORD PTR next[eax],0

	pop	ebx
	pop	esi
	pop	edi
	pop	ebp
        ret     8
Remove  ENDP

        end
