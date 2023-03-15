         TITLE  StrN2D Convert Null-terminated string to DWORD.

         .386
         .model flat

        extern  _ExitProcess@4:Near

        .data
Result  DWORD   ?
String  BYTE    '00000001001000110100',0

        .code
_main:
        push    OFFSET Result ;Address of result
        push    2           ;Radix
        push    OFFSET String ;Address of input string
        call    StrN2D       ;Call the conversion procedure

        push    0
        call    _ExitProcess@4
;
; StrN2D(char *StrPtr, int N, unsigned int *d)
; Input parameters:
;               StrPtr   Points to input string
;               N        Radix of string
; Output parameters:
;               d        Point to longowrd result
;
; Return Value: EAX is 0 if conversion succeeded. Otherwise it is 1.
StrN2D:
StrPtr = 8
N      = StrPtr+4
D      = N+4
        push    ebp             ;Standard prologue
        mov     ebp,esp


        push    edx             ;Saving registers we use
        push    esi
        push    ebx

        mov     ebx,0           ;We handle only bl, then add ebx...
        mov     edx,ebx         ;Clear for MUL
        mov     eax,ebx         ;The number will be summed here

        mov     esi, StrPtr[ebp];Input string
NextDigit:
        mov     bl,[esi]        ;Fetch digit
        inc     esi             ;Point to next digit
        cmp     bl,0            ;Null?
        je      GoodDone        ;Yes, we are done.

        sub     bl,'0'          ;No. Check for legal digit
        jl      BadInput        ;Illegal for sure
        cmp     DWORD PTR N[ebp],10 ;Radix up to 10?
        jg      complex         ;No.
        cmp     bl,N[ebp]       ;Yes, so simple check
        jge     BadInput        ;Digit out of range
        jmp     goon
complex:
        cmp     bl,10
        jl      goon            ;Radix above 10, and input is digit. Fine
        push    ebx             ;Save for possible later attempt
        sub     bl,'A'-'0'-10   ;move to the range [10,radix]
        jl      TryMore         ;Out of range
        cmp     bl,N[ebp]       ;In range?
        jge     TryMore         ;No
        add     esp,4
        jmp     goon            ;Yes
TryMore: pop     ebx
        sub     bl,'a'-'0'-10   ;move to the range [10,radix]
        jl      BadInput        ;Out of range
        cmp     bl,N[ebp]       ;In range?
        jge     BadInput        ;No
goon:  
        mul     DWORD PTR N[ebp] ;Multiply previous sum by radix
        jc      BadInput        ;Overflow...
        add     eax,ebx         ;and add current digit
        jnc     NextDigit       ;Continue if not overflow.

BadInput:
        mov     eax,1
        jmp     Done

GoodDone:
        mov     esi,D[ebp]      ;Store result
        mov     [esi],eax

        mov     eax,0           ;Success code
Done:
        pop     ebx             ;Restore registers
        pop     esi
        pop     edx

        pop     ebp

        ret     12

        end   _main

