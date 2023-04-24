         TITLE initvector   procedure rguments in registers

         .386
         .model flat

        extern  _ExitProcess@4:Near
        
        .data
Vec     DWORD   8 Dup (?)

        .code
_main:
        mov     eax,OFFSET   Vec
        mov     ebx,0F0F0F0F0h
        mov     ecx,LENGTHOF Vec

        call    InitVector

		push	0
        call    _ExitProcess@4
;
; InitVector procedure
; Input parameters:
;               EAX: Pointer to vector
;               EBX: Initial value
;               ECX: Number of elements in Vector
;
; ECX, EAX, are destroyed.
InitVector:
again:
        mov     [eax],ebx
        add     eax,4
        loop    again
        ret
        end   _main       ;end of program. Label is the entry point.

