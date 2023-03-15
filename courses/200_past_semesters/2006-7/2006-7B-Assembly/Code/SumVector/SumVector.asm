         TITLE SUM Proc

         .386
         .model flat

		extern	_ExitProcess@4:Near

        .data
Vec     DWORD   -1,-2,1,2,-3,-4,5,6

        .code
_main:
        push    LENGTHOF Vec    ;length of vector
        push    OFFSET   Vec    ;address of vector

        call    SumVector       ;sum it

		push	0
		call	_ExitProcess@4
;
; DWORD SumVector(VecPtr, Len)
; Input parameters:
;               VecPtr Pointer to vector
;               Len    Length of vector
;
; Return value:
;     In EAX the sum of the vector elements is returned.
;
SumVector:
VecPtr = 8
Len    = VecPtr + 4
        push    ebp             ;Standard entry code
        mov     ebp,esp

        push    esi             ;save registers we are going to destroy
        push    ecx

        mov     esi,VecPtr[ebp] ;esi <- points to vector
        mov     ecx,Len[ebp]    ;ecx <- number of elements in vector
        mov     eax,0           ;eax <- 0 since it is used to hold the sum
again:
        add     eax,[esi]       ;add current element of vector
        add     esi,4           ;point to next element
        loop    again           ;continue until ecx==0

        pop     ecx             ;restore registers
        pop     esi

        pop     ebp
        ret     8               ;return and pop arguments

        end   _main

