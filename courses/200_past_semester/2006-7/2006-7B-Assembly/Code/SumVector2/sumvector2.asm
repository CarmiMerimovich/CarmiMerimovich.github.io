         TITLE SumVector2 - Pass the vector by value

         .386
         .model flat

        extern  _ExitProcess@4:Near
        
        .data
Vec     DWORD   -1,-2,1,2,-3,-4,5,6

        .code
_main:
        mov     ecx, LENGTHOF Vec
        mov     esi, OFFSET   Vec + SIZEOF Vec
more:                           ;Why didn't I use here the label `again'?
        sub     esi,4
        push    DWORD PTR [esi]
        loop    more

        push    LENGTHOF Vec    ;length of vector

        call    SumVector       ;sum it

        push    0
        call    _ExitProcess@4
;
; DWORD SumVector(Len, Vec)
; Input parameters:
;               Len    Length of vector
;               Vec    The vector, BY VALUE. NOT a pointer.
;
; Return value:
;     In EAX the sum of the vector elements is returned.
;
SumVector:
OldEBP  = 0
RetAddr = OldEBP  + 4
Len     = RetAddr + 4
VecOff  = Len     + 4
Temp    = -4
        push    ebp             ;Standard entry code
        mov     ebp,esp
        sub     esp,4           ;Need space for later usage
        push    esi             ;save registers we are going to destroy
        push    ecx

        mov     esi,ebp
        add     esi,VecOff      ;esi <- points to vector
        mov     ecx,Len[ebp]    ;ecx <- number of elements in vector
        mov     eax,0           ;eax <- 0 since it is used to hold the sum
again:
        add     eax,[esi]       ;add current element of vector
        add     esi,4           ;point to next element
        loop    again           ;continue until ecx==0

        mov     esi,Len[ebp]    ;We have the pop the vector of the stack!
        inc     esi             ;add 1 for the length
        add     esi,esi
        add     esi,esi         ;Number of elements * 4

        add     esi,ebp         ;convert the offset into pointer
        mov     temp[ebp], esi  ;Save the pointer

        mov     ecx,OldEBP[ebp] ;move old EBP upwards
        mov     [esi], ecx

        mov     ecx,RetAddr[ebp];Put the return address in the last element
        mov     4[esi],ecx

        pop     ecx             ;restore registers
        pop     esi

        mov     esp,[esp]       ;OBSERVE CAREFULLY! This pops the arguments!

        pop     ebp

        ret                    ;return

        end   _main

