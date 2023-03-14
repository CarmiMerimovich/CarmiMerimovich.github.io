         TITLE InitVector3 (Arguments on stack)

         .386
         .model flat

        extern  _ExitProcess@4:Near

        .data
Vec     DWORD   8 Dup (?)

        .code
_main:
        push    0F0F0F0F0h
        push    LENGTHOF Vec
        push    OFFSET   Vec

        call    InitVector

        push    0
        call    _ExitProcess@4
;
; InitVector(Vec, Len, Value)
; Input parameters:
;               Vec   is address of vector
;               Len   is number of elements in the vector
;               Value is the initial value to set
;
; Argument are pushed right to left.
;
InitVector::
VecPtr= 8
Len   = VecPtr + 4
Value = Len + 4
        push    ebp
        mov     ebp,esp

        push    esi
        push    ecx

        mov     esi,VecPtr[ebp]
        mov     ecx,Len[ebp]
        mov     eax,Value[ebp]

again:
        mov     [esi],eax
        add     esi,4
        loop    again

        pop     ecx
        pop     esi

        pop     ebp

        ret     12

        end   _main

